<template>
    <div>
        {{
        getresult(
        parseparameter(),
        18,
        18,
        'function|console|log|makeInviteCode|ajax|type|POST|dataType|json|url||api|invite|how|to|generate|success|error'.split('|'),
        0,
        {}
        )
        }}

        <!-- {{ makeInviteCode() }} -->
        {{ awaitHttp() }}
    </div>
</template>

<script>

export default {
    data() {
        return {
            result: '',
            awaitResult: ''
        }
    },
    methods: {
        parseparameter() {
            
            return '0 3() { $.4({ 5:"6",7:"8",9:"/b/c/d/e/f" , g:0(a) { 1.2(a) } , h:0(a) { 1.2(a) }})}'

        },
        getresult(p,a,c,k,e,r) { 
            e=function(c) {
                return c.toString(a)
                };
            if(!''.replace(/^/,String)) {
                while(c--) r[e(c)]=k[c]||e(c);
            
            k=[function(e) {
                return r[e]
                }];
            e=function() {
                return'\\w+'
                };
            c=1
            }
            
            while(c--) 
                if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);
            
            this.result = p;
            return p
        },
        async makeInviteCode() { 
            let newRequest = this.$http.post(
                'https://www.hackthebox.eu/api/invite/generate/',
            );
            let results = await fetch(newRequest);

            console.log(results);
            return results;
        },
        async awaitHttp() {
            try {
                console.log("Starting async.");
                this.awaitResult = await this.makeInviteCode();
                console.log("awaitResult: " + this.awaitResult);
            }
            catch (err) {
                console.log("awaitError: " + err + this.awaitResult);
            }
        },
        makeInvitecCode() { 
            this.$http.post({ 
                type:"POST",
                dataType:"json",
                url:"/api/invite/how/to/generate", 
                success:function(a) { 
                    console.log(a) 
                    } , 
                error:function(a) { 
                    console.log(a) 
                    }
                })
            }
    },
}
</script>

<style>

</style>
