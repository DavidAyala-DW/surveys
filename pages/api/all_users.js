async function requestAllUsers(){

  const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/customers/search.json?limit=100&query=orders_count:1`,{
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
    // console.log(allUsers);

    // const {product} = productData;

    res.status(200).json({users: ids})

  } catch (error) {
    res.status(200).json({errorMessage: error})
  }
  
}