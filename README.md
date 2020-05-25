# vanilla_accordion
Easy to use, customisable accordion, written in typescript.

## Features

- responsive 
- no css needed 
- very flexible in the structure of the html 
- many options 
- callback for interactions (open, close);
- methods for toggling the accordion and overwritting options
- can be easily transformed to work with all available build enviroments using the typescript compiler


---
## for your enviroment
As mentioned above it is written in typescript, so just configure the typescript compiler to generate it for your individual needs.     
In the example below i used the following options in tsconfig.json
``` json
{
    "compilerOptions": {
        "outDir": "dist",
        "sourceMap": true
    },
    "include": [
        "src/**/*"
    ],
}
``` 
and run:   
```
$ tsc
```

---
## Initialize
```html

<div class="acc">
    <div class="acc-item">
         <!-- point to a remote content -->
        <button class="acc-header" data-target=".item-a">elsewhere header</button>
    </div>
    <div class="acc-item">
        <button class="acc-header">standard header</button>
        <section class="acc-content">standard content</section> 
    </div>
    <!--  item with className expanded is allready opened -->
    <div class="acc-item expanded">
        <button class="acc-header">standard header</button>
        <section class="acc-content">standard content</section> 
    </div>
</div>
<section class="acc-content item-a">elsewhere content</section> 
 <!-- initialize -->
<script src="./dist/Accordion.js"></script>

<script>  

let acc = new Accordion({

    // defaults ::

    /* can be a selector, a single node or a nodelist */
    item: ".acc", // : string | NodeList | Element
    
    /* if one item extends, all others will close */ 
    oneOpen: true, // : boolean

    /* last extended item cannot be closed */
    oneNeedsToBeActive: false, // : boolean

    /* in default all childNodes of the "item" (> *) are interpreted as accordion items, 
    if you have a more complex, deeper strcuture you can use child_selector */
    child_selector: null, // : string | null

    /* selector for the header, click on it triggers functionality */
    header_selector: ".acc-header", // : string

    /* selector for the content, can be overwritten with targetDataAttribute on the header element */
    content_selector: ".acc-content", // : string

    /* name of the data attribute for defining a content selector on the header element */
    targetDataAttribute : "data-target", // : string

    /* time in ms for the css transition */
    animationTime: 100, // : number

    /* fires each time you interact */
    interact: function (options) { 
        console.log(options)
        /*
        {
            type:string -> "open" | "close"
            items:[] -> all items of the accordion,
            activeItems:[] -> expanded items,
            content:HTMLElement -> content node to interact 
            header:HTMLElement -> header node to interact,
            options:{} -> options the accordion instance is running with
        }
        */
    }
});

// toggle first item
acc.toggle(0)

// overwrite interact later on
acc.interact(function(options){
 // ..
})

</script>
```