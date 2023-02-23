
export const selectDataFormate=(success,list,name)=>{
    return success && list?.length > 0
    ? list.filter(j=>j.status).map((i) => ({
        label: i[name],
        value: i[name],
        ...i,
      }))
    : []
}