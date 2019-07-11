const defaultGenome = 'grch37'
const defaultTrackUrl =
  'http://rest.ensembl.org/overlap/region/human/__CHR__:__START__-__END__?feature=regulatory;content-type=application/json'

function findGetParameter(parameterName) {
  var result = null,
    tmp = []
  var items = location.search.substr(1).split('&')
  for (var index = 0; index < items.length; index++) {
    tmp = items[index].split('=')
    if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1])
  }
  return result
}

new Genoverse({
  container: '#genoverse', // Where to inject Genoverse (css/jQuery selector/DOM element)
  // If no genome supplied, it must have at least chromosomeSize, e.g.:
  // chromosomeSize : 249250621, // chromosome 1, human
  genome: findGetParameter('genome') || defaultGenome, // see js/genomes/
  chr: 13,
  start: 32296945,
  end: 32370557,
  plugins: [
    'controlPanel',
    'karyotype',
    'trackControls',
    'resizer',
    'focusRegion',
    'fullscreen',
    'tooltips',
    'fileDrop'
  ],
  tracks: [
    Genoverse.Track.Scalebar,
    Genoverse.Track.extend({
      name: 'Sequence',
      controller: Genoverse.Track.Controller.Sequence,
      model: Genoverse.Track.Model.Sequence.Ensembl,
      view: Genoverse.Track.View.Sequence,
      100000: false,
      resizable: 'auto'
    }),
    Genoverse.Track.Gene,
    Genoverse.Track.extend({
      name: 'Regulatory Features',
      url: findGetParameter('trackurl') || defaultTrackUrl,
      resizable: 'auto',
      model: Genoverse.Track.Model.extend({ dataRequestLimit: 5000000 }),
      setFeatureColor: function(f) {
        f.color = '#AAA'
      }
    }),
    Genoverse.Track.dbSNP
  ]
})

setTimeout(function() {
  document.getElementsByClassName('gv-fullscreen-button')[0].click()
  document.getElementsByClassName('gv-fullscreen-button')[0].click()
}, 4000)
