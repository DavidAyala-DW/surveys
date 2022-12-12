export default async function handler(req, res) {
  
  const {
    query: {id},
    method,
  } = req

  console.log(id,method);

  try {

    const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/customers/${id}.json`,{
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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'
      }
    });
  
    const response = await request.json();
  
    res.status(200).json({response})

  } catch (error) {
    res.status(200).json({error})
  }
  
}
