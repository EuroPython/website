// @ts-ignore
const { promises: fs, createWriteStream } = require("fs");
const path = require("path");
const matter = require("gray-matter");
const axios = require("axios");
const puppeteer = require("puppeteer");

const fetchCard = async (page: string, browser: any) => {
  console.log(`Fetching ${page}`);

  const { data } = matter(
    await fs.readFile(path.join(process.cwd(), "data", page), "utf8")
  );

  const params = {
    preset: "adobe",
    p: "DwPgUABBwEIPYA9JQgZwQXgN5eSiAJgJaoAOANgIYCeAXBAEQBm5ApggwDR4oAu7vAILkiAcwB29BgGNW4-gCcuPKC3YARIgtbTeROJMbS45AK4BbccvxRKIiQEl%2B51FNnzWS7jYgArU6h6TNQAwgb88m5yitY2AEaU0gDWogpwpuIEUgDEAAwAjPnS%2BQAssfjG5HAKUgDuABZE-OUopJQExOKiUiW5pAgQAOx9HN7xiSlpGQQAykQAXqxu4ZREVmNQAL6byOD4wKgAbqIqaLzUbNi4PlCkcKhN%2BoYMlHGoJqbNGzbzDpns9Fy33wcTgvF4cHM9AATMCUAoxPVePR8gBWOFQWpEAi8epSUojFr4OBtaRNOgQXIAOkGcO2pyxOPqGAY%2BQAnABmfoMU71ViI3gs6EANlR3NOhyIrFq8EwDFylIg7I5EBFqJ5%2BD2NmAojOaSSrBZ4gMrAYergBoAtIzcSz8mamERyOQjSaHU7yJaFKZLgxWIc5HAOgwtT4dad8LwFJRxKgmNVzCyozHUFR%2BAAKS2FUpU3J5-OcCCW1GDQYADlz%2BbzAEoNTdVB6WdkOepBABRaEwOv1x3Or0%2Bw0MY3iRZpbs2UM3HUQZOx%2BMKRMMWepygZy0lCtVvOF6E5re5WuT%2BvANq4wgsgCy%2BQ5HIrqNyHOh6NRwsKVJKwtybMGEBC1%2BhbJUqUJSDGynAvrkFaDCKBRKhy7JUqi%2BTQru4GvtS8G5CWcH5NSWGokhaHXlSZaohywo-n%2B8HClSwpsnmYEQaiVK3l%2BZZwbu74lGRZbgaibI0chuSlhx%2BRcTxfGkTSbJPsKv7-mJJTcbefGDByNIvvk7HXm%2BwploMr58cKJRKgBgGitCZawgRxnyQB6mWQZ%2BRGSZyH6Yh5YlM5Nk0YMSkgaZZbqfxG7eSWYlftB7F-tCoG0V%2BwrWS%2Bvn%2BT%2ByFqVS9G5CUHIuaZFGIeRvE2SZMUEYheY5XlyHcTSSnQiUqnqYMJYiTVzF%2BSUDWSR1MkvnZtWdd1BECUBKHkaZ97vt%2BbLPp%2BzG3k%2BaVLUBHJedZr7qaR5GUTVgy0aBREYch%2BRycht65kpQVoZBNKxfxpmWbRZbChytKaYpn7fnZ%2BT7dej6Ma%2BJQkeR%2BSmbhFX3o1L4iplvSvuDW1lgU72vRWJScnRP3McKopssVxnA5%2BuSJeDgH0fB3nGYBlOoq5KHMeygxomhSGZad2ExShq1lmy0OijRAm5E%2Bj1ibhqIE69VLQpF2kodCJFZRtdEsVpAF2bDIoUfzyMkczb2mRd5ECaj7n3shpkY5lKEtWhZbAzVGN2VLXmkVTuu-WpKrpQrBHXclFZvcJ0KBXhBQFKzC0SyLMXlrm0H8WhpYkeyqKBb7QUveBzPUsMmmBepH4A9nt0CyJMX2yRdN0yXzG9PbgWAXmr5U2y5nQbFpkySRAEUWh%2BOIU%2B2V2bNJGQbj-f7a99mBTRwvMxtzMHZys-x%2BWuUvmRLGZ9FyGcndN6owVp2nWycEPrmMkyUn5PI6ROH7SK9vCnbDsNU7VFPVZaI6-t5sh9eXo1tLIE11vpa8aU1rAzMi-ZKNM1Znyoh%2BXML025oSljLb82k1rMSwjbVmgsJa4zgl5TKfMsKszEmyDmu01qPzLMjQGVtaauQ5GzVET8qZKXiihOCW9KYPjQhdDGxt5JsJonpV8sDEqC3hmDa8U0sIgTmjmIKCN-p3gfE%2BIin1IoQAAFoQCvE%2BKhIFjLZ34rmNEwkBrMQatlYqLV9pKL5obQORVoYtQrOyLCZ9zpiRGrFbOn47ptzBjFciqsurPhakTEs2FzqAQ7mtbOG5cwyysobJJ41PFANfC9FUETsnQhSSWeCZCULyJKQrKKaCSwi2Qg1ICD5mbZxjidQCdNfqMQTuDOu95BH1MFrjWa4NfazWzhyPCL0HoxS-DSW8-toLDLomnISOMQKQTaWsmWEUXoAW2fJdkCtuL43er0woUkPwGVgWpKhnI2FKi0nXCiE8Sx5K0q9I5VzXm3LScLdkZ0tIVn0h%2BaysTaIS2Zk8-er1hIbwMrnMy4TLk0VIl1HpEsgLULUk8uKfNZrgpLLmCCaVfoOS6uRCxTdrG7VOsDASJTvJOXfGtYWTyQm7i0uc4YzSZJksSrRKZVls5x1vJyFFp11LUOEtnKyNJcYW0KLjOGfkEUvSAl1LqeLc5eVFHKzcX4cpHL0ohDG9ts7UNog1XcHL9qMI5D00auFHze1PigsspRwLI2pKFX6Ryl73m-t626TlbWXOpGrG83riJIVin44F75EoqQlm%2BL8sVJUD0AWpENFYRS3lMtlZ6SFHFtzHjLHZEMCick8fRd8iLdoZKFQnENNEymjJOmJfS2VnxBUjTldWJ1fZ5j8t6p62teY-ULlg6GVkaJrT0uDGiIFHy9u5iU95ZNpYKOKt-d8CiQ5czEmtF63krK5z8micGwMbxWQ3sjBW5LB27hvX5Escqm7oVKh0quvQnUVk5ARemsMXwyTPbdRp%2BNDa%2BUcrAz1EV%2BUooargyCu7Y3pT8U%2BdSelfq7tDa%2BcNslmmfJDb6%2BDjbiWLQYZawSWjvZEeMteS1Ylk2QUmsDJSBKDWVj5oU5CWKGpvTlYJLVACRRiUsmic58qDIXJFL7T8j5RWB15vBZ2DLQIilFZG9Ny1OVqhia%2BVlvQxNsz5gZTxliCj3h-PokMwAAD0p56hHm1A50QrmoCOY86cbzk5HNHB8-sQLZwLiGhwBAG0eJGDDAAKRcAgOYSgChRBrHgOCSEMIFTbAgJKaUsoWQKgVE-aWIdk7ChDL5ggrAmCoE89AQIYWQBYAAAZUmkOQVAWYsC9nILQbIrACBljiHmAA3JsdrnXLTQh6x6frOURvQkoONybXWOSzedP1kd2V8grY611koG2%2BvZCYGWAg7I2R7am6iI7-WmD3fGy1zYAXzhsFc456rtX3tBanD948f36zQGcxGG4HXKCoFQCyfbWZxyA-PAwC8livUIXLAANUsoIN81Gse8SBECZyIEPKcEdRpAAEgBFBlBAJeU4NT5yePOC5EtGBfa0awJgQZ0z6WjUFaQVRyq8s0ggTohvS-XigEtN08oFMvWxPqT6UZ4r-H6MOfSCJsKLMLF0QS418DEmtPpYa7p6jyx0FSdGw5Cb1nZZScqq-NIBauPODW8tM1F%2BEvUTM5YmBUxxYSKcC7Rrt8KkmdaRTprm8fu3qu5Ikb98Xunxe5KPoi8aSc3GS4oIYKuVs%2BK%2BcgTuxtI9LS%2BmsT0vDPnKFw18Fe0IP8AOfq-sYHcOKhUAh1Dqb0JYeA4IJeWK7NwLbxL9dLauV8eK%2BarSLajUtqV5TkrxnMfSwx-tleMWMSUHSEtHPXHlo7ye8950w-QFhTS%2BgTn8-C-6dZgrBREIuUSmIRZ9LWkMsUEB4Vgrt-kFze38t79VacnSNaEVHCGW8IXP3bRY9T3cXL3NaQQLebicCQudECvYnfafeDkeoFiaEBAv%2BZlRCenPPTgQnDhAPB3aWJGWnEg%2BfdnFiEodHMsKnagivZnA3QocnJuJg5CD-BfUPQPAPLtQ4bxYUOzOvFABvcQrzZvFvKAMHdvGQKbDkbvesXvBHfvahD-BZEvMiMvXQ8fOfECGPQiYKPQq-GPECPQ-IC8C6LTXIeoS0FiDkSgDhd8Z8E5VApXPfKuDSEITibqR9RqBCEVdEYI2EMAssQ4QYX-Jww4BWNhUnZCPWLfR3RfKtMCClLMAJd3ePMSVpQYTXcsQQtwvPEFfPVWQfDGGgpAmmOgi1Wo%2BoedYUVHNJGSSgN8UsYozotAt8EsLIxCUnUgwYQQGmRqUYvgtCEGTgSyUAjCMsCAz3c-bw0CBPOPV6PA73bOTYznYnPNF%2BXIC8DQ-PdSR8SgN%2BGgng8fJnPXAoh2Ggr8e4jnBfG4i4mwvYp-Fw5iBXcqBXNAiXGpVENXLXBZTgKCF%2BF4sE2nRgygKCdEWE8w2-WkMozgynJIg5NEp4vHLMR9F%2BJI-IKI2PRI9fFIxWRfPNNkdcKuBPAogDZwtaTVYnB2RqNA0PO8EoYoHAv3QiZiMibwvmQQvkkoGIzkUAtFIUt-LqWY7eBY9-Y9fIS0faHNME5nBArtd6NUq-dAzKbDMQ2QyQ2Qk8VceoKQlAeQyHRQtbFQm4NQ1PKeKfG9MsTHQCC1YI5k4g%2B8LU-IKnd8WEanWEHYrteUmkT0MaRwkmdor4-PSM8wk46Eaba1aYmpF%2BbmAyCY4GJCTXVCDjWkbMiYwPTXdkQQBWPSaY56CYreB42KFwliWBGsvgxwgoklFOefHYrnFmYs3iDs%2Bs-M4sh-GkZyGpIgrE3KZyO8UExCbs0s2KLfeOUrRw4iJSec8yU-N-EpaY6kNcznRwqyeMwydMgnQg7s7FTXL-Msrsrc0XAPWibyS%2BQfB41szgWiNkc3JJSgLs88rwgJMCYGXmccqlQOfYhfBWIJCKQExCRmXiMWY9Ec56etCM7eAPVIrcljX2RqXM3M5C2PK89kUsl8XCwCrEko4s1-DSUs22HYliRUwYwYN8wCQoaYuiocxXfs13K0%2BvRvFAQ03EE0uQtvc06HZQni%2BHN4pwgPJJMsBwxCJgmpEi7oq-aWADMipSnYjkLMccuEicgM%2BM2KIs1-WkHYpSAPLaJbNEUvUyqotA4s2EE4ooa8q8p6PCxSO8XE98MscgMWEoAskoeoXIdy1aAsjkLraWNI1yxwl8eCsg0ysg1gmy3ch-E4nnBKtMxCTMwQDjA8mnHYwiCGAyN8qS3Cp3BnJNXc4Y32dEMqtM2ozgZdGclCRfJNequiMM5omiJbYs5M2iAikK0iOKpSmpeskc8c2EPNSc4CwYGc4SOczVLiRw9q9okFXEha%2Bs8PKy6otazCuMgQhTfC%2Bs9qxwpA1C3Ct0rEljMCXnQEoESg5ij8Zqmkc3Fczq0sieLc1arap8p6zE4g3KdGYan0iY4CyC6QcCoCSCoCaCq8gqD8doueH3GGo8ozAiaojKpi0PLCsWM6onX2fSrwhq9q3Cvs-QzUiTCShWahXUlvfUlvLi402Q3i8HfipQtimwG0gAjIsjPKiePGgM2iGgthQfayYKiilWEmVHNhIs2iHnCW-66yqeB62SiY1S0czYwOT6-HbSx0p8CczWzwhnIJGXbgr40Iw2zU3ssvR8IGly-vRy%2BtRCFykCPy68AKnyh2xWzVIKnC1Gow22%2BCz1RClsvPGPR8Xc2ER-cxUO46xXfc1KjjdahfFJfvPyPKvC7aii7iXcjqmuQ6l6klTXOiQfKlBaLqrnRskmVANs%2BqtEDmjq56z82PYOj6hurcwan68crqUahSiax%2BIMhczy6WTq%2BahqsPD8Zaz1eu9KpGo89kE8l%2BHPZax1Wa6It-DhJO8q8Co8mC-SIXR8uqy6m63MCRZ89kKup6ou3qrtVevO4s1WgPYnIau%2BnYsa8g4GrSbC8GljdGRs8qU6TXeZSPFCs1M498WOk6tG6WJmqASmuHamoSs0jvS0oSlm508I5xVEcWnNGpMfICgJAPU-Fulu7mrCdW6YvSiYuu4KVB0y22ShnWm%2BrTBcjkC2%2By5yq8tJa2jcF2p23yjygKygVWCo1g1aCfOy7DJioM%2BVfILPUvadE29Mg3BhEMnKfa%2BIssMM8arnfXNs-0%2Bcmi4KayweTUwuAo8hsvKqQuTB8fU2iTSWsg32f0hfeg%2BMwiQ6rOrw863OxiOswu5apq-e9HRCcWksj83WxUoI9o%2BI0I8J%2BsnGEOriLe-ylBQ3ec49MsAAGTquw2hC3zyIhrjMfRzx7njKY18lEPAYgEgcB2gdpogFgYtNYoQcvFwVgTiQ5s7LLJUrUrzW%2BquoIc9zGt0uIbzKBEJ1AngqqPMs%2BoHITJssYeJttpYeYaco4Y8udu4bFkCtmpCo3DCtP3Gb9osoDtitWu5j7mOexoZ3TMzIkYdN5sKrzxzOBjUhaaetudRt1xrNqrH32v2McLztyEOHnNRCeaCe6o11NsHLIpRtdxvo-tbrObSKnPGrDLzTjOmsXL7txgHqKLDyKK3IKeLKuZwN5rsYZzbQyJoqxtwrhaZz2txsxqJ0wpIpJjiZ3sfKQMuronJw5ovpoepcfN4jYUPIFcIlTt4gdg0ttnhIfpBqfpfGlbFniJgtNRAmhuxRwdVcwsFRrgZVhG1fhqCKBpJmlkZgCRBoVXaNloDwte5qEy2lRHIEKkZ14aXlaQfIZM-1LJee3qvK2RytpF9dIdBq2U-xIt%2BPsY1RAlKfKePBkNkJqYEtKagBZoqIpy0hCDhjlwOkeqUxKJvC1w5pIr7gMvjiUfHPMVvwjrVsfqCSCQopemMIobrh90bc1LZp9ItvKIcrtoWdcods8uWa4f8rWaCq0acu2fgqoY6hoflMOYTMfyEznapZoM9wk2Ronu5rrfRspa3dTtBcet9lwr1c134hCD%2Bh5yBBqRDoclCOTborLEjY4ukKNJgb4rgbqaqZtPKgeOIiskoEflyj-bzLqlj3%2BZvRhJ5tv2WuQk124h8q5aep5bPqrj6ppDzOJ3vZNMqdprjcZvqYR3cWzm9NlSbkXZNcfHFssJOUXfw5LHQ4NOc2qZfdqeUOEqE18oj0Z3I4xv2YZ1Y7NCjanBjZb2w-gffYabRQf2PQYNOlWhL0SjLzk42tkS3YpdxeHrxv3f3e5ugghtrz1IfaByfaqeE-XATZY8ZlhF5Vek9BYwKM-2FH%2BYaiBvglmt9kcLekILc7cqmrD01tOmrI3hYk1KfOtX0XMHjLrYZXlJs-C%2BaNqg3AHrXJ8-MbzwOkcLZBTwp0ahCV9oTtnRaPnTZBGJYKAupxINEMOLbWfGYjOp-OKktw-Htb8m51k5nyloov3l%2Bgy%2Bw0YgHJ1e8Xq-TOhHta2VyF-fjmd3G%2B5sTnyBTxUhJ1InIDbPN2pH4koHnWqsC9YM-z7JfpDvMJRc6MVOf0Olxf4jCtwM6ToMTgfvl1ym4kOA8pDIAjCq9JplpDe%2BWo3CvO12K8IoCJQQe9znIAFoog5PydtgVY277nUi9TZHaPErEppE9bFavNaRl1tnR55a0KEysa1P5Pc-5Kla-GLAzdTPR6Lu%2B8VsHMGLFmkrsWTPp5jM2JzDehDKFddsdpANqmXsfEJd56UzQOlXHK-2LMTJ5rQJQ6wKRjSsLxINl5Uv5edPVBNP47DEE7h2M7KFw4vBaiwvKSUhnO-rqjc9doxnO%2B0o11DOmlmuXbc4pMUg5Gs9OqvLZBaIeZMr%2BsUmJYD1mrdLQvrKCO3QReD9xdemmKvNBs9fKPIiBu4W5kwOvZJzInqFAsEGvLsrQLk6th0cNzLzsLjosLUZj05EX3tVQP6Jxd9-qsiWc-3VR97vya2alrsU2vIGw0906paN7NJz8hDKY1G-94vJJXsslqYzydIZnonOCla5rildqiUxsrNpRuJwsIgOgX0u8Nn%2BxJTlo6pvV8B019M4-dFYdlP2fCPNHvIZCHKmHt6HAgecr06WhhnzZBnNr4ah%2BZRab5kgbOcKSNlX-5wt5SwFIIibgig0U6KdBD2rXUsJAhF%2Bi-bOhPGyIR9r2pECfgWynyCtDyUrI2B1U0Kk1l%2BxZV3Gv33pkkwaaRR9IMBaK5BpAxZa5g7BIosweSOZMaLvygb796wxnXTrTRtJp5-2ikQrrnlzwGFwIwFZyMXlMKmEYqrlPQiUAvB24fc4lBwlQIxw45ii1GNAkMWJxJJUQKJSCN6Rpx056yz%2BNnL93qr-c%2BcAueYsLl5pi4DckufdNLmsre8gQt7FhpXk-z8tPBExeBNByKDq4I82uRJnrhyIigk8%2BQE3NkhiI3grc28W3DDQoIh4Jut4JfKEOPyOoXenlL4hHyDzJM0iZRCPKpQWhGM661OBPMfjkFp5Go0EFBGlTGgXE7GRBbhH3GLwOwDy9FItrKgdgch5BcNN-G9CBKZUJup0D1hpT7g%2B4SIvEP%2BIH1-JJFfyyuUKlQgC5BQV8sBW-OLnNwhNDg0-FPneEODLphQW9BgVC1PbeFroIKEoFnhOQeC6%2BgvPYs7h0aV5RGzOCPK-0DpZgzhqlQuPKRBSqULhLROirg3yp3hbmzkOclQg0q%2B0yimpdGJ5TRTChqKHkTHNcK0JDCGcpuB-GWHRwYRBg5NOHKr04ruYOKmHDXox2hzK9ZCLNW6BalXL2dmobIBwrhH2H1B982whVKTgHgvR9hrlFPhuQ5BsjQIHIjjK71pF4ibgBIx9txVjZkjrspTFmh0Urx5oVBc8BEcqlFr7QNwW9R9OjHB4Y0RU9I2TnowU5x0POZjdHCqPqDQJ7OaIe1gcg5CJFH80IFJo0gHxdRJKwkNboI0EjJd5SjMDGolC3zSpmSfuPmIUzjLVc4RLEJmhKIM5SihOMorrBSJbws0ZcJfWGCTHqA157WVUDOIAxLJExQRvNL4fUI6gBcc0llWPM9BDIY9wK1ZQ6L1F2pmofmgJTXCXyZww8JhdMGPFpgyZu996DhK0YwWthiifAMYkkQfwTHFg5Rl4H%2BFm0ZgXV1waXVSsuhUbt9t8rlNbAqlLKLk3cg%2BM2Bt00LdcDxRQfFkI2giON%2BWd0dcT0NKCf4MiC4jUWhUhRe4yCgcTyp0hibmIgQ9qHuBN3FyK40Uq4yFAHjwga4VMIE-el1kVLV4UECpBVC%2BIqziExxHAmwMZyTFw4WaEPawTHiaqPp5SVov3IlEpIigHC2o4QoPHqAZxpAMPTwi3x-rvQ5yVosLp5UVIMMFoiudGK00IicTkhiuOuJ5VHzjlv6EuJEifgcL8i3xA4yitiMNwjibAyEwzvGPpqvt0JPeGcSX3n5c9MmMeFmIpD9wj5EmXxXKK1TyrtkgIWPSjqWXNqWS4BNZabGbQ1zziwul3WQRAS7J5E3medZqHGR3zxlOQ%2B1VSg81BaUkDI%2Bk80f2MHGRIkIWo8yaVjLxk94pp%2BeAfwxNHPdC44UjMYONISeppcm7cpNALVpAMWxZZG9MWJfpoo4JE8CqVtG%2BYdQg8IMP3KFIeaCV8RxIlCa3mUm1NVJqhPvAUCFS7FwKoBSAZaMNzcj9II0oKGyIAhSTJpdFBhuezimTMs4JyPsi9EAYqRrmOA1ShpD8qyokyYHKoirnMLplA%2BT4EkveS5K9NMol09cVhGjFtTFJpIzqeSOnHqEh64RSAejinieiRhgkLqgeRWG855i3kviSCSBmD508LEPsRmOInNFeeJYNyWDQCmpD4y54t3LJ3k4DV8q5DB7nkSkkighp2KOSexXELjjOBk47qdaT7zcIc884tfml0jFbNsMGuFcZuIh4zVmoz4PWBOUFhz4SyvM2gQmVslqQLx8U5cSxEOLwzrKD4riDQVFAvjfqa0BWfB0Vw-iRU9qYroBJwmhFQJ3hHHqBKgk0gShkEOCcvk6SITWppM9qaaQpmvTDiNjC0cFC8581gKgLZdEXnrSakeSuTaSNRIz6D5L6AcsCK1QG79jYZotDsojK0j7UV8tnJ8rHJa7ycK22svQliO4QwzoEIBFNriPulWzHpE456bKJNJUjH6UsBhBAW%2BG51Apdk7rpSXIgci0UbIcibNBT7alBZXqWyWnWQEoFKS-EMLk7PXGZNsMbparuEVJKjy9xgFK6Z0V8gH4pis8oUR5FiF6RiZEhB6XGKekKEXpxcmcYazzoqoAIy8m3LhCbkq4t6XaQPvrhREadHBgRUsh3KAqUV4y8EI%2BZRJYjkTeYMUjMqYhIIhTwSOk6-A-0zKLEWK5%2BXOewPznkzC5iYu2fxgUrVU20EBCTI2X0jTZn5tnB0fiW8qBkOSWcBaWi2WkzVoQYXcCn7i8hILt4aXKLql0CK51oiJ0NkW6Id4clDIC02KA2UlrsK8iqIYxAimejty-eYNKWm0OJx5Vro23cwl2gxroNJhHrQsbY2JwxSbqeROfKPR-KT9PUUktEEfNXkQN159QBjtAqnHCV-wpA4lHpH5x7F6gUcOIsoIOg6K%2BO%2BiwxVvNlEmLSEcnXlABESIk5Lc5ikmjgTsxlN9FJpNCbAuQTmI-FiFWECqiUg%2BVX58RVHJ4oZHaUhuZCmAplB8rNzSJUMvxboqCV5yN5BclxTAp3kI5Ton%2BcQVBCxFGZ7YzokJFVMd6-9Myk-FCNNlbm995yMFOmASSQitz9ID3Qgg4TqmWKkeeShSYUqgXFKpxpSq8J4vRCmo0cNSkoHUu8TiDGlCyZpXn1ybtKSgffLpSUB6X5A%2BlgwAZb0saktUqlYypxaEpMVxRUIMSwYFJMtwZ4%2BYI0jkIEvGU00lJUyymT4BZrXQFl1Si%2Bc6LARZd1l54iTC0uAE7K9l33A5fgWOWnKjl5ykZeWCuUFKvlm8hmiUspHqTecwc6AlJJfCRCFk9QZxNaJrKY4MII5alXmU0IqxUQhwaSIkV5j-NrY7RakNfAhjXxBeSMu9khOCXSijFvy5mupPw4qxEo9rXGNBySm3l1I95eSnHGMjFAUuKQ-Ksk2g5YjLEt4SicIRcLgRzCDJYmmRUlqjotuA%2BQMgaqnaoyUFgwcBRU2tl00fldsmWK1WDlTxnl0IXVXYnmk31gqeRU6RMMTosYXKNdCvNeSPZUDEouqtFIMHtZMZkmjIg6HsqzCwcJFEi81SpAkxZMWyqMzanmvC5sh7V0bSBaDltkzLdwdicQVPBAJYpeYuq2-K-3HxB9FIUi9wXB2LJY8gyIobMTBXggl40e-ZSRZlB5Jb5gKWjcJtByulsI-JXeAVRipCXlrcV6hTWrKl5QvR%2BcNMbSYpCJieViKLDCkvus-wlB2iN9bmgmvjgcl%2B%2BcKhmTeviKDBmJzPIVDoTnzCtiCeRVGYV0h6Q9LKq5aqlGq9XQhDgDzJtX6vKLadFIqPXAgEjHnRUgKq6l%2BBRH5zQhycsUAkihHgo49ihhq3bvAociXjLITPEwmDRzXdFdyvdQGRLUKYWzAcnyxdcKpdUHIVYIoIGo7Skp2TuZKwvWKZIxoFSb6ikJ8tZyHWcyPh9BN8n-mmISaJeGZByC1No2Crvl2K6ZcusllbrqqP5V-gU21LYV6pNOMWLuxFDtEjW9lBDsenqlUpgoGRJ-I2LobmShNxPZBdWUI12JCxzM3OqataY4svq9Q0mjqzqg0EzVAdVtWXmQhpNhE1VKCOThyinLkl9CTdeiogUTKy1DGitVbHfQvL2S7YhstOxIgnkV8XWKRdbBPLfkYpQUO6PFIj6tdBgqAc%2BtuRQHF9iFhE5khXOkjfdwxnsraAUTrjVaQZAScHgLT7b0FB8XY6fMNoEkaRc6nuETd1uLUCdS1PgUJRWtlbiCNNQNHctprFgFFgtm2i3kZqgLGbMK0eMzfJz5mQtgKLlG0T-RUaObGejPXldKpYweayKrm8gb5oC1PjAtatYLTD1SU1JWuaIEaa9Bi12LD5dEBLQ6vm2oSl1yYvvBnjIIZ5P5Wmkvvpr8E6bdtEma9tokO3mbJ%2BicSzTZou2og0mhkIzJXTsQeMDk92%2BqWHSR7PaDGPm62O9qZ2sFvtY0Yndhgi00hAdQGr8iDuqXpdZt%2BwIkb5mF1C7As4AHgMAAAAqAgU4OgCuAg54w8gOYIsHoC0hFd4QAAOr8hRASINXduBBz8AEAvAKXdGDnAJgpApgUgKQE8DSBwcpoOkDsE1CnAsAAAR1MCeBqAVIPkO0BEDiBWATuwkTLuN3%2BZg9vAOXZgBwAa7ldCwJYBAEajR7eA2ugUPQCmRAgQcdwB4HoAMBSBtAaYIgAGCJAQB6QzunwG7o90KAvddu0gNnvECB6vMDmMPVqEcyyhwAjmEAKNiAA",
    headline: data.title,
    caption: data.subtitle || "",
  };

  const url = new URL("https://cards.microlink.io/");

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const output = path.resolve(
    __dirname,
    "..",
    `public/social-cards/${page.replace(".md", "")}.png`
  );

  const p = await browser.newPage();

  p.setViewport({ width: 843, height: 444, deviceScaleFactor: 2 });

  await p.goto(url.href, {
    waitUntil: "networkidle0",
    timeout: 0,
  });

  const element = await p.$("#screenshot");

  await p.screenshot({
    path: output,
    captureBeyondViewport: false,
  });
};

const fetchCards = async () => {
  const pages = (await fs.readdir(path.join(process.cwd(), "data"))).filter(
    (p: string) => p.endsWith(".md")
  );

  const chunks = [];
  for (let i = 0; i < pages.length; i += 5) {
    chunks.push(pages.slice(i, i + 5));
  }
  const browser = await puppeteer.launch({
    // headless: false,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  for (const chunk of chunks) {
    await Promise.all(chunk.map((page: string) => fetchCard(page, browser)));
  }

  await browser.close();
};

fetchCards()
  .then(() => console.log("done"))
  .catch((err) => console.error(err));
