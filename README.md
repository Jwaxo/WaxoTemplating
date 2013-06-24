WaxoTemplating
==============

A series of tests for a templating engine.

In this latest version, we include both basic (and mostly bug-fixed) {% if %}, {% else if %}, {% else %} functionality, as well as {% for %} loops.

## Variables

Variables to be pulled into the template must be defined at the time of the template calling in the loader script. Variables should be objects or arrays of objects or objects of objects.

To call a variable and display it, use {{ }} markup, as in {{ variable }}.

To use a variable within a function, name it using dotpath markup, such as {% if variable.property %}

## if Statements

"if" statements can now be made using the templating {% if [function] %} functionality. All if statements require an {% endif %} tag to close the if. You may use {% else %} and {% else if [function] %}, although else if functionality is still in testing.

Due to the constraints of the templating language, different markup for standard functional operators has to be utilized. Consult the following list, cribbed straight from $smarty:

== | eq
!= | ne, neq
 > | gt
 < | lt
>= | gte
<= | lte

## for Loops 

"for" loops should work pretty simply, using the following 'for'mat: {% for [item] in [items] %}Loop this {{ item }}.{% endfor %} Note that "items" should be a pre-defined variable, and "item" should not already be a variable.