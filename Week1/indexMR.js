'use strict';

{
  function fetchJSON(url, cb) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url); // async by default
    xhr.responseType = 'json';
    xhr.onload = () => {
      if (xhr.status < 400) {
        cb(null, xhr.response); // we call the callback function. null means that there is no error
      } else {
        cb(new Error(`Network error: ${xhr.status} - ${xhr.statusText}`)); // print the error
      }
    };
    xhr.onerror = () => cb(new Error('Network request failed'));
    xhr.send();
  }

  function createAndAppend(name, parent, options = {}) {
    const elem = document.createElement(name);
    parent.appendChild(elem);
    Object.keys(options).forEach(key => {
      const value = options[key];
      if (key === 'text') {
        elem.textContent = value;
      } else {
        elem.setAttribute(key, value);
      }
    });
    return elem;
  }

  function main(url) {
    fetchJSON(url, (err, data) => {
      // this is the callback function
      const root = document.getElementById('root');
      if (err) {
        createAndAppend('div', root, { text: err.message, class: 'alert-error' });
      } else {
        allrepoinfo = data;
        //createAndAppend('pre', root, { text: JSON.stringify(data, null, 2) }); //we use the data variable and show it
        //console.log(data);
        //SELECT AND OPTION
        createAndAppend('header', root, { id: 'pageHeader' });
        createAndAppend('h1', pageHeader, { id: 'pageTitle', text: 'HYF Repositories' });
        createAndAppend('select', pageHeader, { id: 'selectOption', class: 'repo-selector' });
        loadNames(data);

        //INFORMATION
        createAndAppend('div', root, { id: 'left' });
        loadInformation(data[0]);

        //CONTRIBUTORS
        createAndAppend('div', root, { id: 'right' });
        createAndAppend('h2', contributors, { id: 'contributorsTitle', text: 'Contributors' });
        createAndAppend('ul', contributors, { id: 'contributorsList' });
        loadContributors(data);
      }
    });
  }

  let allrepoinfo = null;

  const HYF_REPOS_URL = 'https://api.github.com/orgs/HackYourFuture/repos?per_page=100';

  window.onload = () => main(HYF_REPOS_URL); // the url is passed here

  function loadNames(data) {
    //let reposNames = []; // create an empty array for the respos names list
    //reposNames.push(data[i].contributors_url);
    for (let i = 0; i < data.length; i++) {
      // loop over the response
      //the option af alumni has disappeared and the option Angular JS has doubled???
      document.getElementById('root').addEventListener = createAndAppend('option', selectOption, {
        value: i,
        text: data[i].name,
        class: 'repo-options',
      });
      data.sort((a, b) => a.name.localeCompare(b.name)); //sort a to z

      document.getElementById('selectOption').onchange = function() {
        let e = document.getElementById('selectOption');
        //console.log(e.selectedIndex);
        let str = e.options[e.selectedIndex].text;
        //console.log(str);
        //console.log(allrepoinfo[e.selectedIndex].description);
        document.getElementById('left').innerHTML = allrepoinfo[e.selectedIndex].description;

        document.getElementById('right').innerHTML = allrepoinfo[e.selectedIndex].contributors_url;
      };
    }
  }

  /*function loadInformation(data) {
    let reposDesc = [];
    reposDesc.push(data.description);
    document.getElementById('left').innerHTML = reposDesc;
  }
  //function loadContributors() {
  //TODO: Implement me!!!
  //}

  /*let reposDesc = [];
  let reposContributors = [];
  let reposFork = [];
  let reposUpdate = [];
  // create an empty array for the lists

  //for (let i = 0; i < data.length; i++) {
    // loop over the response
    reposContributors.push(data[i].contributors_url);
    reposDesc.push(data[i].description);
    reposFork.push(data[i].forks);
    reposUpdate.push(data[i].updated_at);
  }

  document.getElementById('left').innerHTML = reposDesc;
  document.getElementById('right').innerHTML = reposContributors;

  console.log(reposDesc);
  console.log(reposContributors);
  console.log(reposFork);
  console.log(reposUpdate);

  //let response = JSON.parse(xhr.responseText); // reading the value/raw data of the responseText and converting the JSON string into an actual JSON object.
  //console.log(response);*/
}
