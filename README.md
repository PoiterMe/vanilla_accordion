# vanilla_accordion
Easy to use, customisable accordion, written in typescript.

---
## Generate it for your enviroment
As mentioned above it is written in typescript, so just configure the typescript compiler to generate it for your individual needs.     
In the example below i used the following options in tsconfig.json
``` json
{
    "compilerOptions": {
        "target": "ES5",
        "sourceMap": true,
        "outDir": "dist",
    }
}
``` 
and run:   
```
$ tsc src/Accordion.ts
```

---
## Initialize
```html

<div class="acc">
    <div class="acc-item">
         <!-- point to a remote content -->
        <div class="acc-header" data-target=".item-a">elsewhere header</div>
    </div>
    <div class="acc-item">
        <div class="acc-header">standard header</div>
        <div class="acc-content">standard content</div> 
    </div>
    <!--  item with className expanded is allready opened -->
    <div class="acc-item expanded">
        <div class="acc-header">standard header</div>
        <div class="acc-content">standard content</div> 
    </div>
</div>
<div class="acc-content item-a">elsewhere content</div> 
 <!-- initialize -->
<script src="./dist/Accordion.js"></script>

<script>  
let acc = new Accordion({

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

    /* selector for the content, can be overwritten with data-target on the header selector */
    content_selector: ".acc-content", // : string

    /* time in ms for the css transition */
    animationTime: 400, // : number

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