<template>
    
</template>

<script>
export default {
    name:'Index',
    created(){
        let redirecturl = this.$route.query.redirecturl
        for(let k in this.$route.query)
        {
            if(k == 'redirecturl')
                continue;
            redirecturl += `&${k}=${encodeURIComponent(this.$route.query[k])}`
        }
        window.location.href = redirecturl
    }
}
</script>