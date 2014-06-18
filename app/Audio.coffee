@Audio = class
  constructor: ->
    @effects = {}
    @loadEffect 'chomp'
    @loadEffect 'death'
    @loadEffect 'flipper'
    @loadEffect 'start'

  loadEffect: (name) ->
    @effects[name] = document.createElement('audio')
    @effects[name].setAttribute 'src', "assets/audio/#{name}.wav"
    @effects[name].setAttribute 'preload', 'auto'
