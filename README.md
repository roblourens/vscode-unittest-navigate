# Unit Test Navigate

Adds your unit test definition calls to the symbols list for easier navigation of javascript and typescript unit test scripts. Supports `describe`, `it`, `suite`, and `test` calls.

Open your test file and trigger "Go to symbol in file" (cmd/ctrl+shift+o)

Before:

![before](https://raw.githubusercontent.com/roblourens/vscode-unittest-navigate/master/images/before.gif)

After:

![after](https://raw.githubusercontent.com/roblourens/vscode-unittest-navigate/master/images/after.gif)


## Notes
It will work when one of these function calls is the first non-whitespace text on the line, and its first parameter is a string.