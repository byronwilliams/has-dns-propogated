DNS Resolver Check

Idea: See when DNS has propogated as an API and get a notification when changed
Why? Because sometimes sites take a long time and it would be good to have
    a notification mechanism when it's done


Step 1: See if the DNS has updated directly at the Zone's edge.
    i.e. if the Whois information lists ns1.linode.net as the primary NS then
    we should look the record up there first.

    If the the primary NS is not up to date the test fails

Step 2: If the primary NS is up to date, then we need to see if the zone has
    propogated yet.

    We can check each of these servers.

    If any fail the test fails
        OpenDNSA: 208.67.222.222
        OpenDNSB: 208.67.220.220
        GoogleA: 8.8.8.8
        GoogleB: 8.8.4.4
        Norton: 198.153.194.50
        Comodo: 8.20.247.20
        Level3: 209.244.0.3
        OpenNIC: 87.216.170.85
        DNSWatch: 84.200.69.80
        HE: 74.82.42.42
        FreeDNS: 37.235.1.174

Step 3: Provide an estimation of when the DNS will be available based upon the
    max of the TTLs returned by Step 2

Step 4: API

    ======================================================================
    POST /new
    {
        hostname string,
        type string,
        expected string,
        notify_email string,
    }

    Returns: Result of ```GET /result{id}```
    ======================================================================
    GET /result/{id}

    X-Rate-Limit-Remaining: 50-n
    {
        id id,
        time_started int (datetime.utcnow()),
        time_completed int (datetime.utcnow()),
        percent int,
        max_ttl int,
        passing: [
            "FreeDNS",
            "HE",
            ...
        ],
        failing: [
            "GoogleA",
            ...
        ]
    }
    ======================================================================

