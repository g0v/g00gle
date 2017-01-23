/* globals fetch */
var yo = require('yo-yo')
var qs = require('querystring')
var result

var query = qs.parse(window.location.search.replace(/^\?/, '')).q

if (query) search(query)

function search (query) {
  fetch(`https://api.search.g0v.io/query.php?q=${query}`).then(x => {
    return x.json()
  }).then(res => {
    result = res
    yo.update(document.querySelector('#result'), renderResult(result))
  })
}

function renderResult (result) {
  if (!result) return null

  console.log('render', result)
  var rs = []
  result.hits.hits.forEach(x => {
    rs.push(x._source)
  })
  var el = yo`<div id="result">
    <div class="ui very relaxed items">
      ${rs.map(renderItem)}
    </div>
  </div>`
  return el
}

function renderItem (item) {
  return yo`<div class="item">
    <div class="content">
      <a class="header blue" href="${item.url}">${item.title}</a>
      <div class="meta">
        <span>${item.source}</span>
      </div>
      <div class="description">
        <pre>${item.content}</pre>
      </div>
      <div class="extra">
        Additional Details
      </div>
    </div>
  </div>`
}

function render () {
  yo.update(document.querySelector('#app'), yo`
    <div id="app">
      <div class="ui action input">
        <input id="search" type="text" value=${query || ''} onkeypress=${keypress}></input>
        <button class="ui button">搜尋</button>
      </div>
    </div>
  `)

  function keypress (e) {
    if (e.keyCode !== 13) return

    var query = document.querySelector('#search').value
    search(query)
  }
}

render()
