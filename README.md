# Shakespeare++

In the realm of code, ***Shakespeare++*** doth reign, a language so tender, that toucheth the very heart, With words most noble and syntax most poetic, it transforms the art of programming into a sonnet of logic and elegance.

*Prithee, try our* **[VSCode extension](https://marketplace.visualstudio.com/items?itemName=premades.spp).**

*And verily, explore our* **[online playground](https://shakespeareplusplus.vercel.app/).**

# Installation

Ensure thy [Node.js]() hath been setup upon thou device

## For Linux and Mac

Open thy **terminal** and *inscribe* thy following command:

```bash
npm install -g shakespeareplusplus
```

Shouldst thou be met with a ***permission error***, thou might need to prefix the command with `sudo` to grant it proper authority.

```bash
sudo npm install -g shakespeareplusplus
```

## For Windows

Open thy **Powershell** in *administrator* mode and inscribe thy following command:

```bash
 npm install -g shakespeareplusplus 
```

Execute thy command to run thou *script*

```powershell
Set-ExecutionPolicy RemoteSigned
```

Learneth more about *[Powershell ExecutionPolicy ](https://learn.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_execution_policies?view=powershell-7.4#powershell-execution-policies)*

Invoke this command to discern the location of **Node.js** upon thine *system*, and thus add it to thy              *[Path Environment Variable](https://stackoverflow.com/questions/44272416/how-to-add-a-folder-to-path-environment-variable-in-windows-10-with-screensho)* *(add the "folder" where node.js is installed)*

```powershell
node -p "process.execPath"
```

# Run

To commence thy ***execution*** of thou script

### In Repl Mode:

```ba
shakespeare++
```

### Execute a (.spp) file:

```bas
shakespeare++ <filename>
```

# Syntax

### Variable Declaration

```bash
granteth yonder varName withUtmostRespect
```

### Variable Initialization

```bash
granteth yonder varName equivalethTo value withUtmostRespect
```

### Constant Initialization

```bash
  steadFast yonder varName equivalethTo value withUtmostRespect
```

### Array Initialization

```bash
granteth yonder arr[] equivalethTo {10 20 "30" ...} withUtmostRespect
```

### Accessing Array

*Access first element*

```bash
arr addethPolitelyWith 0
```

*Access second element*

```bash
arr addethPolitelyWith 1
```

### Function

```bash
summonThouMechanism function(parameter1 invokeThouComma parameter2...) {
	<statements>
	<last statement will automatically be returned
}
```

*Demonstration: Behold! thy sum of two numerical values*

```bash
summonThouMechanism sum(x invokeThouComma y){
	x addethPolitelyWith y
}
```

### Object initialization

```dart
granteth yonder obj equivalethTo {
	shake summonThyColon 10 invokeThouComma
	speare summonThyColon "plusplus" invokeThouComma
	sum summonThyColon summonThouMechanism s(x invokeThouComma y) {
		x addethPolitelyWith y
	} 
} withUtmostRespect

printethThouWordsForAllToSee(obj fullethStop shake)
printethThouWordsForAllToSee(obj fullethStop speare)
printethThouWordsForAllToSee(obj fullethStop sum(10 invokeThouComma 20))
```

### For Loop

*will runneth thy loop 10 times*

```bash
forsoothCyclethThroughThyRange(
    granteth yonder i equivalethTo 0 withUtmostRespect
    i `lessThanThou` 10 withUtmostRespect
    i equivalethTo i addethPolitelyWith 1 withUtmostRespect) {
	<statements>
}
```

*Note: don't forget the `` in lessThanThou*

### While Loop

```bash
whilstThouConditionHolds(*condition*) {
	<statements>
}
```

### If Statement

```bash
providethThouFindestThyConditionTrue(*condition*) {
	<statements>
}
```

### Else Statement

```bash
elsewiseRunnethThis {
	<statements>
}
```

### If Else Statement
```bash
providethThouFindestThyConditionTrue(*condition*) {
	<statements>
} elsewiseRunnethThis {
	<statements>
}
```

### If Else If Statement
```bash
providethThouFindestThyConditionTrue(*condition*) {
	<statements>
} elsewiseRunnethThis providethThouFindestThyConditionTrue(*condition*) {
	<statements>
}
```

### Null

`ashollowAsAFoolsHead`

### False
`asFalseAsAFlimsyFabric`

### True
`asTrueAsTheLightOfDay`

## Binary Operators:

### =
`equivalethTo`

### +

`addethPolitelyWith`

### -

`subtractethPolitelyWith`

### *

`multiplethPolitelyWith`

### /
`dividethPolitelyWith`

### %
`modulethPolitelyWith`

## Comparsion:

*Note: Don't forget the ` at the start and end*

### &&

```bash
`andeth`
```

### ||

```bash
`either`
```

### ==

```bash
`equivalethTo`
```

### !=

```bash
`notEquivalethTo`
```

### <

```bash
`lessThanThou`
```

### >

```bash
`greaterThanThou`
```

### <=

```bash
`lessThanEquivalethToThou`
```

### >=

```bash
`greaterThanEquivalethToThou`
```

## Others:

### .

```bash
fullethStop
```

### ,

```bash
invokeThouComma
```

### :

```bash
summonThyColon
```

### Statement Terminator

```bash
withUtmostRespect
```

## calculationShenanigans Object:

### abs()

```bash
calculationShenanigans fullethStop unveilThyAbsoluteWorth(value)
```

### sqrt()

```bash
calculationShenanigans fullethStop revealThouRootsWhimsy(value)
```

### random()

```bash
calculationShenanigans fullethStop witnessThisErrantDigit(min invokeThouComma max)
```

### log2()

```bash
calculationShenanigans fullethStop logOfTwosMeasure(value)
```

### log10()

```bash
calculationShenanigans fullethStop logOfTenFold(value)
```

### max()

```bash
calculationShenanigans fullethStop greatestOfThemAll(val1 invokeThouComma val2...)
```

*Note: can take any number of arguments*

### min()

```bash
calculationShenanigans fullethStop littlestOfThemAll(val1 invokeThouComma val2...)
```

*Note: can take any number of arguments*

## Time:

```bash
revealThyTime()
```

*Note: returns the current timestamp in milliseconds since (January 1, 1970, 00:00:00 UTC)*

## Input:

### inputString()

```bash
readethThineStringInput()
```

### inputNum()

```bash
readethThineNumInput()
```

## Import Other (.spp) Files:

```bash
summonYonFile("filename.spp")
```

## Comments:

```bash
scribeThyThoughtsInSecretLines
*anything*
endethSecretLines
```

# Honours

* Thanks be unto thee, *[tylerlaceby](https://www.youtube.com/@tylerlaceby)*, for the wondrous series thou hast bestowed.                

* Gratitude be unto thee, *[FaceDev](https://www.youtube.com/@FaceDevStuff)*, for the inspiration thou hast bestowed.                