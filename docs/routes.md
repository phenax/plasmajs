## Routing on PlasmaJs: 

 Isomorphic routing which renders the content on the server-side and then lets the javascript kick in and take over the interactions. (The server side rendering only works for Push State routing on the client side, not Hash routing).

 ##### NOTE: Its better to isolate the route definitions to its own file so that the client-side and the server-side can share the components

### History API:

There are 3 types of routing available: 

	- Backend routing(new NodeHistoryAPI(request, response))
	- Push State routing(new HistoryAPI(options))
	- Hash routing(new HashHistoryAPI(options)) (NOTE: The naming is just for consistency)


### The Router:
```javaScript 
<Router history={history} wrapper={Wrapper}>
  {allRouteDeclarations}
</Router>
```
Props:

- history (object) - It's the history api instance you pass in depending on the kind of routing you require.

- wrapper (React component class) - It is a wrapper for the routed contents

### How to declare a route:

If Homepage is a react component class and / is the url.

```javaScript 
<Route path='/' component={HomePage} />
```
Props:

 - path (string or regex) - The url to route the request to 

 - component (React component class) - The component to be rendered when the route is triggered

 - statusCode (integer)  - The status code for the response

 - caseInsensitive (boolean) - Set to true if you want the url to be case insensitive

 - errorHandler (boolean) - Set to true to define a 404 error handler
