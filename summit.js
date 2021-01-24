//----------------------------------------------------------//
// This is a minimal spa (single page application) framework
// Insipired by react, vue and svelte
// created by petros koulianos
// The server has to render only the index page and the framework will fetch and render the components
// The index page must have elements with <component/> name and  component,js, css attributes 
// example: <component html="components/layout/header.html" js="components/layout/header.js" css="components/layout/header.css"></component>
// The html attribute is required for the framework to fetch the component from the server
// The html attribute must have the route to fetch the component from the server
// The js and css attributes are optional and is filled if we need to load js or css files with the component
// The js,css attribute must have the route to fetch the js,css files from the server
// The framework has a simple router to change the pages inside the application
// The router will listen for hash route changes such '/#home','/#term','/#posts/post-1' etc 
// The framework will render the proper component for example the '#home' route will render the BASE_COMPONENT_DIR/home component
// and will be renderd at the element with id=main example: <component id=main"/>
// The components are lazy this means that the framework will only fetch the components that need to be render
// Components can have inner component elements and will be render properly
// The framework listen for the index.js page to load and listen for any hash route 
// If the url has a hash route the framework will render the proper component
//----------------------------------------------------------//


// configuration consts
// the dir of the components at the server
const BASE_COMPONENT_DIR = "components/";
// the main component to render components with router
const MAIN_COMPONENT_ID = 'main';

//framework consts
const CACHE_COMPONENTS = new Map();
const INITIAL_RENDER_COMPONENT = true;

// Read the url of the rendered page and render the components
window.onload = function () {
  var hashPage = document.location.hash.split("#")[1];
  if (hashPage) {
    var hashPage = document.location.hash.split("#")[1];
    var root = document.getElementById(MAIN_COMPONENT_ID);
    let componentKey = `${BASE_COMPONENT_DIR}${hashPage}.html`;
    root.setAttribute('html', componentKey);
    root.innerHTML = null;
    this.fetchComponents();
  } else {
    this.fetchComponents();
  }
  this.initializeRouter();
};

// The framework router
function initializeRouter() {
  window.onpopstate = function () {
    var hashPage = document.location.hash.split("#")[1];
    var root = document.getElementById(MAIN_COMPONENT_ID);
    // set the main component element to render the hashPage component
    let componentKey = `${BASE_COMPONENT_DIR}${hashPage}.html`;
    root.setAttribute('html', componentKey);
    this.fetchComponents();
  };
}


/**
 * Fetch the components from the server
 * The components are fetch from the server on demand (lazy components)
 * After a component is fetched stored in a Map to be cached
 */
function fetchComponents() {
  let componentsArray = document.getElementsByTagName("component");
  for (let i = 0; i < componentsArray.length; i++) {
    node = componentsArray[i];
    componentKey = node.getAttribute("html");
    if (componentKey) {
      if (CACHE_COMPONENTS.get(componentKey)) {
        renderComponent(node, CACHE_COMPONENTS.get(componentKey), !INITIAL_RENDER_COMPONENT)
        //recursion to fetch any inner components
        fetchComponents();
        continue;
      }
      let xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            renderComponent(node, this.responseText, INITIAL_RENDER_COMPONENT)
          }
          if (this.status == 404) {
            renderComponent(node, "Component not found", INITIAL_RENDER_COMPONENT)
          }
          CACHE_COMPONENTS.set(componentKey, this.responseText)
          //recursion to fetch any inner components
          fetchComponents();
        }
      };
      xhttp.open("GET", componentKey, true);
      xhttp.send();
      return;
    }
  }

}

/**
 * This function renders components and it's js and css files
 * @param {Element} node element to render the component
 * @param {string} component the html to render
 * @param {boolean} initialRender 
 */
function renderComponent(node, component, initialRender = true) {
  //render component to node
  node.innerHTML = component;
  node.removeAttribute("html");

  let jsFile = node.getAttribute('js');
  // load js file
  if (jsFile != null && initialRender) {
    let script = document.createElement('script');
    script.setAttribute('src', jsFile);
    document.head.appendChild(script);
    node.removeAttribute("js");
  }
  let cssFile = node.getAttribute('css');
  // load css file
  if (cssFile != null && initialRender) {
    let css = document.createElement('link');
    css.setAttribute('href',cssFile);
    css.setAttribute("rel", "stylesheet");
    document.head.appendChild(css);
    node.removeAttribute("css");
  }

}
