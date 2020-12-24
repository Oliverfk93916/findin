
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function (svelteRouting) {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.31.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    let brownStyles = [
          { elementType: "geometry", stylers: [{ color: "#ebe3cd" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#523735" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#f5f1e6" }] },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#c9b2a6" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "geometry.stroke",
            stylers: [{ color: "#dcd2be" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ae9e90" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#93817c" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#a5b076" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#447530" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#f5f1e6" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#fdfcf8" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#f8c967" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#e9bc62" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#e98d58" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [{ color: "#db8555" }],
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#806b63" }],
          },
          {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.fill",
            stylers: [{ color: "#8f7d77" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ebe3cd" }],
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#b9d3c2" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#92998d" }],
          },
        ];

    function mapCurrentLocation(){
    	let map = new google.maps.Map(document.getElementById('interactiveMap'), {
    				center: new google.maps.LatLng(51.52641389999999,-0.051092),
    				disableDefaultUI: true,
    				zoom: 18,
    				mapTypeId: google.maps.MapTypeId.ROADMAP,
    				styles: brownStyles,
    			}
    		);
    }

    /* src/pages/Home.svelte generated by Svelte v3.31.0 */

    const file = "src/pages/Home.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let span;
    	let button;
    	let i;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let label;
    	let t3;
    	let input;
    	let t4;
    	let div7;
    	let li0;
    	let div3;
    	let h50;
    	let t6;
    	let small0;
    	let t8;
    	let p0;
    	let t10;
    	let small1;
    	let t12;
    	let li1;
    	let div4;
    	let h51;
    	let t14;
    	let small2;
    	let t16;
    	let p1;
    	let t18;
    	let small3;
    	let t20;
    	let li2;
    	let div5;
    	let h52;
    	let t22;
    	let small4;
    	let t24;
    	let p2;
    	let t26;
    	let small5;
    	let t28;
    	let li3;
    	let div6;
    	let h53;
    	let t30;
    	let small6;
    	let t32;
    	let p3;
    	let t34;
    	let small7;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			span = element("span");
    			button = element("button");
    			i = element("i");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			label = element("label");
    			label.textContent = "INGREDIENT";
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			div7 = element("div");
    			li0 = element("li");
    			div3 = element("div");
    			h50 = element("h5");
    			h50.textContent = "Store 1";
    			t6 = space();
    			small0 = element("small");
    			small0.textContent = "rating";
    			t8 = space();
    			p0 = element("p");
    			p0.textContent = "Item.";
    			t10 = space();
    			small1 = element("small");
    			small1.textContent = "more item info.";
    			t12 = space();
    			li1 = element("li");
    			div4 = element("div");
    			h51 = element("h5");
    			h51.textContent = "Store 2";
    			t14 = space();
    			small2 = element("small");
    			small2.textContent = "rating";
    			t16 = space();
    			p1 = element("p");
    			p1.textContent = "Item.";
    			t18 = space();
    			small3 = element("small");
    			small3.textContent = "more item info.";
    			t20 = space();
    			li2 = element("li");
    			div5 = element("div");
    			h52 = element("h5");
    			h52.textContent = "Store 3";
    			t22 = space();
    			small4 = element("small");
    			small4.textContent = "rating";
    			t24 = space();
    			p2 = element("p");
    			p2.textContent = "Item.";
    			t26 = space();
    			small5 = element("small");
    			small5.textContent = "more item info.";
    			t28 = space();
    			li3 = element("li");
    			div6 = element("div");
    			h53 = element("h5");
    			h53.textContent = "Store 4";
    			t30 = space();
    			small6 = element("small");
    			small6.textContent = "rating";
    			t32 = space();
    			p3 = element("p");
    			p3.textContent = "Item.";
    			t34 = space();
    			small7 = element("small");
    			small7.textContent = "more item info.";
    			attr_dev(i, "class", "fas fa-bars");
    			add_location(i, file, 19, 3, 331);
    			add_location(button, file, 18, 2, 319);
    			add_location(span, file, 17, 1, 310);
    			set_style(div0, "position", "fixed");
    			set_style(div0, "top", "10px");
    			set_style(div0, "left", "10px");
    			set_style(div0, "z-index", "2");
    			add_location(div0, file, 16, 1, 246);
    			attr_dev(div1, "id", "interactiveMap");
    			attr_dev(div1, "class", "mapHome");
    			set_style(div1, "z-index", "1");
    			set_style(div1, "position", "fixed");
    			add_location(div1, file, 23, 1, 385);
    			attr_dev(label, "for", "formGroupExampleInput");
    			attr_dev(label, "class", "form-label");
    			set_style(label, "margin-bottom", "0");
    			add_location(label, file, 33, 2, 842);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			attr_dev(input, "id", "formGroupExampleInput");
    			add_location(input, file, 34, 2, 942);
    			attr_dev(div2, "class", "mb-3 ingredientInput");
    			set_style(div2, "position", "absolute");
    			add_location(div2, file, 32, 0, 777);
    			attr_dev(h50, "class", "mb-1");
    			add_location(h50, file, 40, 6, 1236);
    			attr_dev(small0, "class", "text-muted");
    			add_location(small0, file, 41, 6, 1272);
    			attr_dev(div3, "class", "d-flex w-100 justify-content-between");
    			add_location(div3, file, 39, 4, 1179);
    			attr_dev(p0, "class", "mb-1");
    			add_location(p0, file, 43, 4, 1328);
    			attr_dev(small1, "class", "text-muted");
    			add_location(small1, file, 44, 4, 1358);
    			attr_dev(li0, "class", "list-group-item list-group-item-action");
    			add_location(li0, file, 38, 2, 1123);
    			attr_dev(h51, "class", "mb-1");
    			add_location(h51, file, 49, 6, 1550);
    			attr_dev(small2, "class", "text-muted");
    			add_location(small2, file, 50, 6, 1586);
    			attr_dev(div4, "class", "d-flex w-100 justify-content-between");
    			add_location(div4, file, 48, 4, 1493);
    			attr_dev(p1, "class", "mb-1");
    			add_location(p1, file, 52, 4, 1642);
    			attr_dev(small3, "class", "text-muted");
    			add_location(small3, file, 53, 4, 1672);
    			attr_dev(li1, "class", "list-group-item list-group-item-action");
    			add_location(li1, file, 47, 2, 1437);
    			attr_dev(h52, "class", "mb-1");
    			add_location(h52, file, 58, 6, 1864);
    			attr_dev(small4, "class", "text-muted");
    			add_location(small4, file, 59, 6, 1900);
    			attr_dev(div5, "class", "d-flex w-100 justify-content-between");
    			add_location(div5, file, 57, 4, 1807);
    			attr_dev(p2, "class", "mb-1");
    			add_location(p2, file, 61, 4, 1956);
    			attr_dev(small5, "class", "text-muted");
    			add_location(small5, file, 62, 4, 1986);
    			attr_dev(li2, "class", "list-group-item list-group-item-action");
    			add_location(li2, file, 56, 2, 1751);
    			attr_dev(h53, "class", "mb-1");
    			add_location(h53, file, 67, 6, 2177);
    			attr_dev(small6, "class", "text-muted");
    			add_location(small6, file, 68, 6, 2213);
    			attr_dev(div6, "class", "d-flex w-100 justify-content-between");
    			add_location(div6, file, 66, 4, 2120);
    			attr_dev(p3, "class", "mb-1");
    			add_location(p3, file, 70, 4, 2269);
    			attr_dev(small7, "class", "text-muted");
    			add_location(small7, file, 71, 4, 2299);
    			attr_dev(li3, "class", "list-group-item list-group-item-action");
    			add_location(li3, file, 65, 1, 2064);
    			attr_dev(div7, "class", "list-group");
    			set_style(div7, "width", "95%");
    			set_style(div7, "margin-left", "2.5%");
    			set_style(div7, "margin-top", "2.5%");
    			add_location(div7, file, 36, 2, 1021);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, span);
    			append_dev(span, button);
    			append_dev(button, i);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, label);
    			append_dev(div2, t3);
    			append_dev(div2, input);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div7, anchor);
    			append_dev(div7, li0);
    			append_dev(li0, div3);
    			append_dev(div3, h50);
    			append_dev(div3, t6);
    			append_dev(div3, small0);
    			append_dev(li0, t8);
    			append_dev(li0, p0);
    			append_dev(li0, t10);
    			append_dev(li0, small1);
    			append_dev(div7, t12);
    			append_dev(div7, li1);
    			append_dev(li1, div4);
    			append_dev(div4, h51);
    			append_dev(div4, t14);
    			append_dev(div4, small2);
    			append_dev(li1, t16);
    			append_dev(li1, p1);
    			append_dev(li1, t18);
    			append_dev(li1, small3);
    			append_dev(div7, t20);
    			append_dev(div7, li2);
    			append_dev(li2, div5);
    			append_dev(div5, h52);
    			append_dev(div5, t22);
    			append_dev(div5, small4);
    			append_dev(li2, t24);
    			append_dev(li2, p2);
    			append_dev(li2, t26);
    			append_dev(li2, small5);
    			append_dev(div7, t28);
    			append_dev(div7, li3);
    			append_dev(li3, div6);
    			append_dev(div6, h53);
    			append_dev(div6, t30);
    			append_dev(div6, small6);
    			append_dev(li3, t32);
    			append_dev(li3, p3);
    			append_dev(li3, t34);
    			append_dev(li3, small7);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div7);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let ingredient = "";

    	onMount(() => {
    		mapCurrentLocation();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		link: svelteRouting.link,
    		navigate: svelteRouting.navigate,
    		onMount,
    		mapCurrentLocation,
    		ingredient
    	});

    	$$self.$inject_state = $$props => {
    		if ("ingredient" in $$props) ingredient = $$props.ingredient;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/pages/Settings.svelte generated by Svelte v3.31.0 */

    function create_fragment$1(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Settings", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.31.0 */

    // (13:0) <Router>
    function create_default_slot(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new svelteRouting.Route({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	route1 = new svelteRouting.Route({
    			props: { path: "/settings", component: Settings },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(13:0) <Router>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let router;
    	let current;

    	router = new svelteRouting.Router({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Home, Settings, Router: svelteRouting.Router, Route: svelteRouting.Route, Link: svelteRouting.Link });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}(svelteRouting));
//# sourceMappingURL=bundle.js.map
