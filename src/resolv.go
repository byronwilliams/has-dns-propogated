package main

import (
    "github.com/miekg/dns"
    "net"
    "os"
    "log"
    "fmt"
    "strings"
    "encoding/json"
    "net/http"
)

type Record struct {
    name string
    addr string
}

type SingleResult struct {
    Name string
    TTL uint32
}

type Result struct {
    Passing []SingleResult
    Failing []SingleResult
    FQDN string
    Expected string
    Type string
}

func getSOA(c *dns.Client, fqdn string) string {
    m := new(dns.Msg)
    m.SetQuestion(dns.Fqdn(fqdn), dns.TypeSOA)
    m.RecursionDesired = true

    r, _, err := c.Exchange(m, net.JoinHostPort("208.67.222.222", "53"))
    if r == nil {
        log.Fatalf("*** error: %s\n", err.Error())
    }

    if r.Rcode != dns.RcodeSuccess {
            log.Fatalf(" *** invalid answer name %s after MX query for %s\n", os.Args[1], os.Args[1])
    }

    // Stuff must be in the answer section
    for _, a := range r.Answer {

        if soa, ok := a.(*dns.SOA); ok {
            return soa.Ns
        }

    }

    parts := strings.Split(fqdn, ".")

    return getSOA(c, strings.Join(parts[1:], "."))
}

func lookup(c *dns.Client, fqdn string, dtype string, server string) (string, uint32) {
    m := new(dns.Msg)
    m.SetQuestion(dns.Fqdn(fqdn), dns.StringToType[strings.ToUpper(dtype)])
    m.RecursionDesired = true

    r, _, err := c.Exchange(m, net.JoinHostPort(server, "53"))
    if r == nil {
        log.Fatalf("*** error: %s\n", err.Error())
    }

    if r.Rcode != dns.RcodeSuccess {
            log.Fatalf(" *** invalid answer name %s after MX query for %s\n", os.Args[1], os.Args[1])
    }
    // Stuff must be in the answer section
    res := ""
    ttl := uint32(0)

    for _, a := range r.Answer {
        ttl = a.Header().Ttl

        if cname, ok := a.(*dns.CNAME); ok {
            res = cname.Target
            break
        }

        if arec, ok := a.(*dns.A); ok {
            res = arec.A.String()
            break
        }
    }

    return res, ttl
}

func check(fqdn string, dtype string, expected string, records *[]Record) Result{
    result := Result{}
    result.FQDN = fqdn
    result.Expected = expected
    result.Type = dtype
    result.Failing = make([]SingleResult, 0)
    result.Passing = make([]SingleResult, 0)

    log.Println("Checking", fqdn)

    // config, _ := dns.ClientConfigFromFile("/etc/resolv.conf")
    c := new(dns.Client)
    soaAddr := getSOA(c, fqdn)
    primaryNSResult, priNSTtl := lookup(c, fqdn, "A", soaAddr)

    priNSResult := SingleResult{
        Name: soaAddr,
        TTL: priNSTtl,
    }

    for _, record := range *records {
        res, ttl := lookup(c, fqdn, dtype, record.addr)

        if res == expected {
            result.Passing = append(result.Passing, SingleResult{record.name, ttl})
        } else {
            result.Failing = append(result.Failing, SingleResult{record.name, ttl})
        }
    }

    if primaryNSResult == expected {
        result.Passing = append(result.Passing, priNSResult)
    } else {
        result.Failing = append(result.Failing, priNSResult)
    }

    return result
}

func GetHandler() http.Handler {
    records := []Record{
        Record{"OpenDNS.A", "208.67.222.222"},
        Record{"OpenDNS.B", "208.67.220.220"},
        Record{"Google.A", "8.8.8.8"},
        Record{"Google.B", "8.8.4.4"},
        Record{"Norton.A", "198.153.194.50"},
        Record{"Comodo.A", "8.20.247.20"},
        Record{"Level3.A", "209.244.0.3"},
        Record{"OpenNIC.A", "87.216.170.85"},
        Record{"DNSWatch.A", "84.200.69.80"},
        Record{"HE.A", "74.82.42.42"},
        Record{"FreeDNS.A", "37.235.1.174"},
    }

    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")

        fqdn := r.URL.Query()["fqdn"][0]
        dtype := r.URL.Query()["type"][0]
        expected := r.URL.Query()["expected"][0]

        res := check(fqdn, dtype, expected, &records)

        b, err2 := json.Marshal(res)
        if err2 != nil {
            fmt.Println("err2or:", err2)
        }

        w.Write(b)
    });
};


func main() {
    http.Handle("/", GetHandler())
    log.Fatal(http.ListenAndServe("127.0.0.1:7777", nil))
}
