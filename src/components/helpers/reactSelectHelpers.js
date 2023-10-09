export const getValue=(id,name)=>{
    return id
    ? {
        value: id,
        label: name,
      }
    : null
}