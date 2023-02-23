export const onlyNumber=(str)=>{
    const pattern=/[^0-9+]/;
    return pattern.test(str) ? str.slice(0,-1) : str;
}