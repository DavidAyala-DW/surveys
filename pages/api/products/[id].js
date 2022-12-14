async function requestProductInfo(id){

  const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/products/${id}.json`,{
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN
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

    const [productData] = await Promise.all([requestProductInfo(id)]);
    const {product} = productData;

    res.status(200).json({product})

  } catch (error) {
    res.status(200).json({errorMessage: error})
  }
  
}
