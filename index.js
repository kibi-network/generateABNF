/*
This script generates an ABNF file from the `abnf` code blocks in a markdown source.
To run: call `node generateABNF $Input $Output`.
*/

const {
		statSync
		, readFileSync
		, writeFileSync } = require("fs")
	, apg = require("apg-api")
	, chalk = require("chalk")
	, INPUT = process.argv[2]
	, OUTPUT = process.argv[3]

if ( INPUT && OUTPUT && statSync(INPUT).isFile() ) {
	console.log(chalk.black.bgYellowBright("[NOTE: ]") + `Generating ABNF for ${ INPUT }...`)
	const specLines = readFileSync(`${ INPUT }` , { encoding: "utf-8" }).split("\n")
		let current = ""
			, match = null
			, output = ""
			, reading = false
			, title = void{ }
		specLines.forEach(( line , lineno ) => {
			if ( reading ) {
				if ( line.trim() == "```" ) {
					reading = false
					if ( lineno < specLines.length && (match = specLines[lineno + 1].match(/^ *{: *id="(.*)"}$/) || specLines[lineno + 1].match(/^ *{ *#([\w-]+) *}$/)) ) output += `\r\n; <#${ match[1] }>:\r\n`
					else output += `\r\n; Line ${ lineno }:\r\n`
					output += current
					current = "" }
				else current += line.replace(/^(?: *)/, "") + "\r\n" }
			else if ( line.substring(line.length - 7) == "```abnf" ) {
				if ( output == "" ) output += `; Generated from the Markdown source of ${ title || "a specification" }.\r\n`
				reading = true }
			else if ( !title ) title = (line.match(/^# *(.*?)(?: *#)?$/) || [])[1] })
		if ( output != "" ) {
			let api = new apg(output)
				, hasErrors = false
			api.scan(true)
			if ( api.errors.length ) {
				api.errors.forEach(( error ) => {
					let lines = output.split("\r\n")
					console.log(chalk.bold.red("ABNF scan error: ") + `Line ${ error.line + 1 }, character ${ error.char + 1 }: ${ error.msg }`)
					console.log(`> ${ lines[error.line] }`) })
				hasErrors = true }
			else {
				api.parse(true)
				if ( api.errors.length ) {
					api.errors.forEach(( error ) => {
						let lines = output.split("\r\n")
					console.log(chalk.bold.red("ABNF parse error: ") + `Line ${ error.line + 1 }, character ${ error.char + 1 }: ${ error.msg }`)
						console.log(`> ${ lines[error.line] }`) })
					hasErrors = true } }
			if ( hasErrors ) {
				console.log(chalk.black.bgRedBright("[FAIL: ]") + `...${ INPUT } has one or more errors!`)
				return }
			writeFileSync(OUTPUT, output)
			console.log(chalk.black.bgGreenBright("[DONE: ]") + `...written to ${ OUTPUT }.`) }
		else console.log(chalk.black.bgYellow("[WARN: ]") + `...${ INPUT } has no associated ABNF!`) }
