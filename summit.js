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
async function fetchComponents() {
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

      try {
        let response = await fetch(componentKey);
        let component = await response.text();
        renderComponent(node, component, INITIAL_RENDER_COMPONENT);
        CACHE_COMPONENTS.set(componentKey, this.responseText)
        //recursion to fetch any inner components
        fetchComponents();
      } catch (err) {
        renderComponent(node, "Component not found", INITIAL_RENDER_COMPONENT)
      }
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
