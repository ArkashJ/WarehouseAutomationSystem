module.exports = async function (context, req) {

    context.bindings.documents = [req.body];
    
      context.res = {
          // status: 200, /* Defaults to 200 */
          body: JSON.stringify(req.body)
        };
    }