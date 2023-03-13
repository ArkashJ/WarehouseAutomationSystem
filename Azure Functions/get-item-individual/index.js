module.exports = async function (context, req) {
    var documents = context.bindings.documents;
    let shipper = {};
  
    const name = req.query.name;
  
    for (const i in documents) {
        if (documents[i].Data[0].Shipper_ID === name) {
            shipper = documents[i];
        }
    }
  
      context.res = {
          body: JSON.stringify(shipper)
      }
  
  
  
  //   context.res = {
  //       // status: 200, /* Defaults to 200 */
  //       body: JSON.stringify(documents)
  // };
  }