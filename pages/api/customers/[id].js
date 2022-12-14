async function requestCustomerInfo(id){

  const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/customers/${id}.json`,{
    method: "GET",
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN
    }
  });

  const response = await request.json();

  return response

}

async function requestOrders(id){

  const request = await fetch(`https://www.kurufootwear.com/admin/api/2022-10/orders.json?customer_id=${id}`,{
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
  } = req

  try {

    const [customerData, ordersData] = await Promise.all([requestCustomerInfo(id),requestOrders(id)]);
    const {id: userID , email, first_name, last_name, state} = customerData["customer"];

    const {orders} = ordersData;

    let ordersObjects = [];
    orders.forEach(order => {

      let line_items_objects = [];
      const {line_items} = order;

      line_items.forEach(line_item => {
        const {id,title, quantity, product_id, variant_id, price} = line_item;
        line_items_objects = [...line_items_objects, {id,title,quantity,product_id,price,variant_id}];
      })

      const {id, created_at, order_number, fulfillments, refunds, shipping_address, tags} = order;
      ordersObjects = [...ordersObjects, {id, created_at, order_number, line_items: line_items_objects, fulfillments, refunds, shipping_address, tags, tags2:tags}]
      
    })

    res.status(200).json({customer_info: {id :userID ,email, first_name, last_name, state}, orders: ordersObjects})

  } catch (error) {
    res.status(200).json({errorMessage: error})
  }
  
}
