/*====================================================================================================================================*
  Bittrex API implementaion into Google spreadsheets
  ====================================================================================================================================
  Version:      0.1
  Project Page: https://github.com/coolcash/bittrex-google-script
  Copyright:    (c) 2016 by CoolCash
  License:      GNU General Public License, version 3 (GPL-3.0) 
                http://www.opensource.org/licenses/gpl-3.0.html
  ------------------------------------------------------------------------------------------------------------------------------------
  A library for importing Bittrex API JSON feeds into Google spreadsheets. Functions include:

     getOrderHistory       For use by end users to import a JSON feed from a URL 
     
  .1    Initial release
  
  
  ------------------------------------------------------------------------------------------------------------------------------------
  Requires ImportJSON Script from http://blog.fastfedora.com/projects/import-json
 *====================================================================================================================================*/
function signKey(url, secret) {
  var signature = Utilities.computeHmacSignature(
                       Utilities.MacAlgorithm.HMAC_SHA_512,
                       url, secret,
                       Utilities.Charset.US_ASCII);
  Logger.log(signature);
  var signatureStr = '';
    for (i = 0; i < signature.length; i++) {
      var byte = signature[i];
      if (byte < 0)
        byte += 256;
      var byteStr = byte.toString(16);
      // Ensure we have 2 chars in our byte, pad with 0
      if (byteStr.length == 1) byteStr = '0'+byteStr;
      signatureStr += byteStr;
    }  
  Logger.log(signatureStr);
  return signatureStr;
}
/* Generate Nonce */

function nonceGen() {
  var d = new Date();
  var timeStamp = d.getTime();
  return timeStamp;
}

function getOrderHistory(apik, apis, count, query, options, includeFunc, transformFunc) {
  /* Set important variables */
  var url = 'https://bittrex.com/api/v1.1/account/getorderhistory';
  var transformFunc = "";
  var parseOptions = "";
  var includeFunc = "";
  var query = "";
  var inputapikey = '?apikey=';
  var inputnonce = '&nonce=';
  var inputcount = '&count='
  var nonce = nonceGen();

  /* Bring it all together */
	var uri = url + inputapikey + apik + inputnonce + nonce + inputcount + count;

  /* Sign the message */
  var sign = signKey(uri,apis);
  
  /* Set apisign as header */
  var headers = { 'apisign' : sign, };
  var options = { 'headers' : headers };


  /* Retrieve response and parse the json into the data variable */
  var response = UrlFetchApp.fetch(uri, options);
  var data = JSON.parse(response.getContentText());

  /* Output on screen */
  Logger.log(data);  
  return parseJSONObject_(data, query, parseOptions, includeXPath_, defaultTransform_);
  /*return data;*/
 }
