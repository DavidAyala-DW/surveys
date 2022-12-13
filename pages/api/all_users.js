async function requestAllUsers(){

  const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/customers/search.json?since_id=2&limit=50&query=orders_count:1`,{
  // const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/orders/5078288892141.json`,{
  // const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/orders/5031330775277.json`,{
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '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'
    }
  }); 

  const response = await request.json();

  return response

}

export default async function handler(req, res) {
  
  const {
    query: {id},
    method,
  } = req

  try {

    const [allUsers] = await Promise.all([requestAllUsers()]);
    const {customers} = allUsers;
    
    let ids = [];
    customers.forEach(user => {
      const {id} = user;
      ids = [...ids, id];
    })

    res.status(200).json({users: ids})

  } catch (error) {
    res.status(200).json({errorMessage: error})
  }
  
}
