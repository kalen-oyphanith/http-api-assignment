const respond = (request, response, status, object, type) => {
  if (type[0] === 'text/xml') {
    let xmlString = '<response>';

    const keys = Object.keys(object);
    for (let i = 0; i < keys.length; i++) {
      xmlString += `<${keys[i]}>${object[keys[i]]}</${keys[i]}>`;
    }
    xmlString += '</response>';
    response.writeHead(status, {
      'Content-Type': 'text/xml',
    });
    response.write(xmlString);
    response.end();
    return;
  }

  response.writeHead(status, {
    'Content-Type': 'application/json',
  });
  response.write(JSON.stringify(object));
  response.end();
};

const success = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This is a successful response!',
  };

  respond(request, response, 200, responseJSON, acceptedTypes);
};

const badRequest = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required parameters',
  };

  // does not have valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // error message
    responseJSON.message = 'Missing valid query parameter set to true';
    responseJSON.id = 'badRequest';
    // return with 400 bad request code
    return respond(request, response, 400, responseJSON, acceptedTypes);
  }

  // if the parameter is correct, success status code
  return respond(request, response, 200, responseJSON, acceptedTypes);
};

const unauthorized = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'This request has the required query parameters!',
  };

  if (!params.loggedIn || params.loggedIn !== 'yes') {
    responseJSON.message = 'Missing loggedIn query parameter set to yes.';
    responseJSON.id = 'unauthorized';
    return respond(request, response, 401, responseJSON, acceptedTypes);
  }

  return respond(request, response, 200, responseJSON, acceptedTypes);
};

const forbidden = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  respond(request, response, 403, responseJSON, acceptedTypes);
};

const internal = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };
  return respond(request, response, 500, responseJSON, acceptedTypes);
};

const notImplemented = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  respond(request, response, 501, responseJSON, acceptedTypes);
};
const notFound = (request, response, params, acceptedTypes) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respond(request, response, 404, responseJSON, acceptedTypes);
};

module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
