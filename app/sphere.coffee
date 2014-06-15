class Sphere extends ObjFile
  constructor: (@radius = 1.0) ->
    super('sphere-radius1', 'Icosphere_Icosphere')

window.Sphere = Sphere

window.Skybox = class Skybox extends ObjFile
  constructor: ->
    super('skybox', 'skyboxGround_Circle')
