(function (program) {
  var counter = null
  var submit = null

  function getCharacterCount (text) {
    counter.textContent = text.length
    if (text.length > 140) {
      counter.style.color = '#F44336'
      submit.disabled = true
    } else {
      counter.style.color = 'initial'
      submit.disabled = false
    }
  }

  program.bind = function () {
    counter = document.getElementById('counter')
    submit = document.getElementById('submit')

    document.getElementById('status').addEventListener('keyup', function (e) {
      getCharacterCount(e.target.value)
    })
  }
})(window.program = window.program || {});

(function (program) {
  program.bind()
})(window.program)
