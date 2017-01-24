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
    yo.update(document.querySelector('#result'), renderResult(result, query))
  })
}

function renderResult (result, keyword) {
  if (!result) return null

  console.log('render', result)
  var rs = []
  result.hits.hits.forEach(x => {
    rs.push(x._source)
  })
  var el = yo`<div id="result">
    <div class="ui very relaxed items">
      ${rs.map(item => renderItem(item, keyword))}
    </div>
  </div>`
  return el
}

function renderItem (item, keyword) {
  return yo`<div class="item">
    <div class="content" style="max-width: 100%;">
      <a class="header blue" href="${item.url}">${item.title}</a>
      <div class="meta">
        <span>${item.source}</span>
      </div>
      <div class="description">
        <pre style="word-wrap: break-word; white-space: pre-wrap; max-width: 60%">${highlight(item.content, keyword)}</pre>
      </div>
      <div class="extra">
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

function highlight (text, keyword) {
  const padding = 50
  var first = text.indexOf(keyword)
  if (first === -1) return text

  var last = text.lastIndexOf(keyword)

  var pre = first - padding > 0 ? first - padding : 0
  var post = (last + keyword.length + padding < text.length) ? (last + keyword.length + padding) : text.length
  console.log(first, last, pre, post, keyword.length)

  return text.slice(pre, post)
}
