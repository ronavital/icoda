const { version } = require('winston');
const package = require('./package.json');
const util = require('./util')
const get_version = function( req, res) 
{
	const version_obj = { version: package.version, description: package.description };
	util.is_test() ? version_obj.version += ' test' : null
	res.send( JSON.stringify( version_obj  ) );
}


module.exports.get_version = get_version;

