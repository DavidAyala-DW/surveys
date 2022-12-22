async function setMetafield(id, key, value){

  try {
    const request = await fetch(`https://newvonstore.myshopify.com/admin/api/2022-10/customers/${id}/metafields.json`,{
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': process.env.SHOPIFY_TOKEN_SETTINGS
      },
      body: JSON.stringify({
        "metafield": {
          "namespace": "global",
          "key": key,
          "type": "single_line_text_field",
          "value": value
        }
      }) 
      
    });
  
    const response = await request.json();
    if(response?.metafield){

      const { key, value, namespace, type, updated_at, created_at } = response?.metafield;
      let date;
      if(updated_at){
        date = new Date(updated_at).getTime();
      }else{
        date = new Date(created_at).getTime();
      }

      const message =  `The property customer.metafields.${namespace}.${key} with value '${value}' and type value '${type}' has been updated at: ${date} (unix time)`;
      const status = "successful"

      return {status, message}

    }

    const message = 'Something wrong, try again later.';
    const status = "failed";
    return {status, message}

  } catch (error) {
    
    const message = 'Something wrong, try again later.';
    const status = "failed"; 

    return {status, message, error}

  }

}

export default async function handler(req, res) {
  
  const {
    query: {id},
    method,
    body
  } = req;

  const bodyEntries = Object.entries(body);
  
  try {

    const results = await Promise.all([...bodyEntries.map( async([key,value]) => {
      return await setMetafield(id, key, value);
    })]);

    let response;

    if(results.some(result => result?.status == "successful" )){
      let messages = results.map(item => item?.message);
      let status = "successful";
      response = {messages, status};
    }

    if(results.every(result => result?.status == "failed" )){
      let messages = results.map(item => item?.message);
      let status = "failed";
      response = {messages, status};
    }

    res.status(200).json(response)

  } catch (error) {
    res.status(200).json({errorMessage: error})
  }
  
}
