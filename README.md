# Youzz Widgets

Collection of [Youzz's](https://youzz.net) whose purpose is to be a drop-in
solution into any project external website.

----

## Overview

The widgets are written using [AngularJS](https://angular.io/) and a minimal
set of [Twitter's Bootstrap CSS framework](http://getbootstrap.com/) is used
to stylize the widgets.

These collection of widgets serve as a simple UI for [Youzz's REST
API](https://api.youzz.net/swagger/ui).

---

### Integrating the widgets

In a generic fashion there are two mechanisms to integrate any widget in your
environment.

The simplest way would be to use the
[widgets.inline.js](src/js/widgets.inline.js) file. Simply include it where you
want the widget to be rendered.

The file can be found here in our production environment:

```
https://widgets.youzz.net/v1/js/widgets.inline.min.js
```

This script loads all the dependencies required to run the widget and uses the 
context passed to it via query string to determine what widget should be rendered. 

An example for the [review widget](#review-widget) would be:

```
https://widgets.youzz.net/v1/js/widgets.inline.min.js?client-id=<client-id>&locale=pt&widget=reviews-full&product-id=<product-id>&features=list
```

The second alternative is to include the [widgets.js](src/js/widgets.js) file
directly and append a couple of nodes to your DOM with a set  data-attributes
that'll be picked by the widgets script.

The example bellow would render the product information for the product with the
ID 23:

```
<div data-reviews-product data-client-id="client-id" data-product-id="23"></div>
```

You can find a couple of examples here:

    * [examples/embed.html] - using the inline script

    * [examples/full.html] - using the data attributes

---

### Reviews widget

The reviews widget has the following options. They can be passed either via
query string (if using the ***widgets.inline.js*** file) or via data attributes
(if using the ***widgets.js*** file):

| Parameter  | Required | Options                     | Example                   | Description                                             |
|------------|----------|-----------------------------|---------------------------|---------------------------------------------------------|
| client-id  | yes      | N/A                         | Widgets.Customer.Website  | The client ID assigned to you by Youzz's team           |
| locale     | no       | es, pt                      | pt                        | The locale in which the widget should be rendered       |
| widget     | no       | reviews-full                | reviews-full              | The widget to be rendered                               |
| product-id | yes      | N/A                         | 15                        | The product ID for which the reviews should be rendered |
| features   | no       | list, distribution, product | list|distribution|product | What sections of the widget should be rendered.         |


A sample to render the full reviews widget would be:

```
https://widgets.youzz.net/v1/js/widgets.inline.min.js?client-id=<client-id>&locale=pt&widget=reviews-full&product-id=<product-id>&features=list|distribution|product
```

---

### Using the Angular directives

TODO - How to use the directives directly on the client's code
