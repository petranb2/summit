# summit
This is a minimal SPA framework

This is a minimal spa (single page application) framework
Insipired by react, vue and svelte
created by petros koulianos
The server has to render only the index page and the framework will fetch and render the components
The index page must have elements with <component/> name and  component,js, css attributes 
example: <component html="components/layout/header.html" js="components/layout/header.js" css="components/layout/header.css"></component>
The html attribute is required for the framework to fetch the component from the server
The html attribute must have the route to fetch the component from the server
The js and css attributes are optional and is filled if we need to load js or css files with the component
The js,css attribute must have the route to fetch the js,css files from the server
The framework has a simple router to change the pages inside the application
The router will listen for hash route changes such '/#home','/#term','/#posts/post-1' etc 
The framework will render the proper component for example the '#home' route will render the BASE_COMPONENT_DIR/home component
and will be renderd at the element with id=main example: <component id=main"/>
The components are lazy this means that the framework will only fetch the components that need to be render
Components can have inner component elements and will be render properly
The framework listen for the index.js page to load and listen for any hash route 
If the url has a hash route the framework will render the proper component
