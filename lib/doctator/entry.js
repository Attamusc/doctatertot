var typeMapping = {
  module: 'processModule',
  memberOf: 'processMemberOf',
  static: 'processStatic',
  constructs: 'processConstructs',
  type: 'processType',
  param: 'processParam',
  mixes: 'processMixedIn',
  returns: 'processReturns',
  return: 'processReturns'
};

function Entry(opts) {
  Object.keys(opts).forEach(function(option) {
    this[option] = opts[option];
  }, this);
}

Entry.prototype.processModule = function(moduleDoc) {
  this.isModule = true;
  this.name = moduleDoc.name;
};

Entry.prototype.processMemberOf = function(memberOfDoc) {
  this.memberOf = true;
};

Entry.prototype.processStatic = function(staticDoc) {
  this.isStatic = true;
};

Entry.prototype.processConstructs = function(constructorDoc) {
  this.isConstructor = true;
};

Entry.prototype.processType = function(typeDoc) {};
Entry.prototype.processParam = function(paramDoc) {};

Entry.prototype.processMixedIn = function(mixedInDoc) {
  this.mixins.push(mixedInDoc.name);
};

Entry.prototype.processReturns = function(returnsDoc) {};

Entry.prototype.process = function(docblock) {
  var processFn = typeMapping[docblock.title];

  if (processFn) {
    this[processFn](docblock);
  }
  else {
    console.log('Encountered an un-processable tag type: "' + docblock.title + '"');
  }
};

Entry.make = function(processedFile, entries) {
  var fileEntry = {
    filename: processedFile.name,
    entries: []
  };

  fileEntry.entries = entries.map(function(entry) {
    var docblockEntry = new Entry({
      name: entry.name,
      description: entry.docblock.description,
      memberOf: null,
      isModule: false,
      isStatic: false,
      isConstructor: false,
      mixins: [],
      params: [],
      returns: {}
    });

    entry.docblock.tags.forEach(function(docblock) {
      docblockEntry.process(docblock);
    });

    return docblockEntry;
  });

  console.dir(fileEntry);
}

module.exports = Entry;
