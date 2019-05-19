# generateABNF

	node generateABNF $INPUT $OUTPUT

Pulls ABNF from Markdown blocks like the following :

	```abnf
	Something = Some *Other [Thing]
		; Some thing
	```

If the block is followed by a line of the form `{: #xyz }` or `{: id="xyz"}` ( a Kramdown block inline IAL specifying only an ID ), this will be extracted in a comment to make reading the resulting ABNF file easier.

Spaces preceding blocks *will* be ignored ; tabs, on the other hand, *will not*. This allows you to indent your code blocks in Markdown ( with spaces ) while still maintaining the required whitespace in the resulting ABNF ( using tabs ).
