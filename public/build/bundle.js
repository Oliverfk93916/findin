
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
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
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
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
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
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
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
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
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
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
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
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

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
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

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    const LOCATION = {};
    const ROUTER = {};

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    function getLocation(source) {
      return {
        ...source.location,
        state: source.history.state,
        key: (source.history.state && source.history.state.key) || "initial"
      };
    }

    function createHistory(source, options) {
      const listeners = [];
      let location = getLocation(source);

      return {
        get location() {
          return location;
        },

        listen(listener) {
          listeners.push(listener);

          const popstateListener = () => {
            location = getLocation(source);
            listener({ location, action: "POP" });
          };

          source.addEventListener("popstate", popstateListener);

          return () => {
            source.removeEventListener("popstate", popstateListener);

            const index = listeners.indexOf(listener);
            listeners.splice(index, 1);
          };
        },

        navigate(to, { state, replace = false } = {}) {
          state = { ...state, key: Date.now() + "" };
          // try...catch iOS Safari limits to 100 pushState calls
          try {
            if (replace) {
              source.history.replaceState(state, null, to);
            } else {
              source.history.pushState(state, null, to);
            }
          } catch (e) {
            source.location[replace ? "replace" : "assign"](to);
          }

          location = getLocation(source);
          listeners.forEach(listener => listener({ location, action: "PUSH" }));
        }
      };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
      let index = 0;
      const stack = [{ pathname: initialPathname, search: "" }];
      const states = [];

      return {
        get location() {
          return stack[index];
        },
        addEventListener(name, fn) {},
        removeEventListener(name, fn) {},
        history: {
          get entries() {
            return stack;
          },
          get index() {
            return index;
          },
          get state() {
            return states[index];
          },
          pushState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            index++;
            stack.push({ pathname, search });
            states.push(state);
          },
          replaceState(state, _, uri) {
            const [pathname, search = ""] = uri.split("?");
            stack[index] = { pathname, search };
            states[index] = state;
          }
        }
      };
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = Boolean(
      typeof window !== "undefined" &&
        window.document &&
        window.document.createElement
    );
    const globalHistory = createHistory(canUseDOM ? window : createMemorySource());
    const { navigate } = globalHistory;

    /**
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     * */

    const paramRe = /^:(.+)/;

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    function startsWith(string, search) {
      return string.substr(0, search.length) === search;
    }

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    function isRootSegment(segment) {
      return segment === "";
    }

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    function isDynamic(segment) {
      return paramRe.test(segment);
    }

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    function isSplat(segment) {
      return segment[0] === "*";
    }

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri) {
      return (
        uri
          // Strip starting/ending `/`
          .replace(/(^\/+|\/+$)/g, "")
          .split("/")
      );
    }

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    function stripSlashes(str) {
      return str.replace(/(^\/+|\/+$)/g, "");
    }

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
      const score = route.default
        ? 0
        : segmentize(route.path).reduce((score, segment) => {
            score += SEGMENT_POINTS;

            if (isRootSegment(segment)) {
              score += ROOT_POINTS;
            } else if (isDynamic(segment)) {
              score += DYNAMIC_POINTS;
            } else if (isSplat(segment)) {
              score -= SEGMENT_POINTS + SPLAT_PENALTY;
            } else {
              score += STATIC_POINTS;
            }

            return score;
          }, 0);

      return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
      return (
        routes
          .map(rankRoute)
          // If two routes have the exact same score, we go by index instead
          .sort((a, b) =>
            a.score < b.score ? 1 : a.score > b.score ? -1 : a.index - b.index
          )
      );
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { path, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
      let match;
      let default_;

      const [uriPathname] = uri.split("?");
      const uriSegments = segmentize(uriPathname);
      const isRootUri = uriSegments[0] === "";
      const ranked = rankRoutes(routes);

      for (let i = 0, l = ranked.length; i < l; i++) {
        const route = ranked[i].route;
        let missed = false;

        if (route.default) {
          default_ = {
            route,
            params: {},
            uri
          };
          continue;
        }

        const routeSegments = segmentize(route.path);
        const params = {};
        const max = Math.max(uriSegments.length, routeSegments.length);
        let index = 0;

        for (; index < max; index++) {
          const routeSegment = routeSegments[index];
          const uriSegment = uriSegments[index];

          if (routeSegment !== undefined && isSplat(routeSegment)) {
            // Hit a splat, just grab the rest, and return a match
            // uri:   /files/documents/work
            // route: /files/* or /files/*splatname
            const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

            params[splatName] = uriSegments
              .slice(index)
              .map(decodeURIComponent)
              .join("/");
            break;
          }

          if (uriSegment === undefined) {
            // URI is shorter than the route, no match
            // uri:   /users
            // route: /users/:userId
            missed = true;
            break;
          }

          let dynamicMatch = paramRe.exec(routeSegment);

          if (dynamicMatch && !isRootUri) {
            const value = decodeURIComponent(uriSegment);
            params[dynamicMatch[1]] = value;
          } else if (routeSegment !== uriSegment) {
            // Current segments don't match, not dynamic, not splat, so no match
            // uri:   /users/123/settings
            // route: /users/:id/profile
            missed = true;
            break;
          }
        }

        if (!missed) {
          match = {
            route,
            params,
            uri: "/" + uriSegments.slice(0, index).join("/")
          };
          break;
        }
      }

      return match || default_ || null;
    }

    /**
     * Check if the `path` matches the `uri`.
     * @param {string} path
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
      return pick([route], uri);
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    function addQuery(pathname, query) {
      return pathname + (query ? `?${query}` : "");
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
      // /foo/bar, /baz/qux => /foo/bar
      if (startsWith(to, "/")) {
        return to;
      }

      const [toPathname, toQuery] = to.split("?");
      const [basePathname] = base.split("?");
      const toSegments = segmentize(toPathname);
      const baseSegments = segmentize(basePathname);

      // ?a=b, /users?b=c => /users?a=b
      if (toSegments[0] === "") {
        return addQuery(basePathname, toQuery);
      }

      // profile, /users/789 => /users/789/profile
      if (!startsWith(toSegments[0], ".")) {
        const pathname = baseSegments.concat(toSegments).join("/");

        return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
      }

      // ./       , /users/123 => /users/123
      // ../      , /users/123 => /users
      // ../..    , /users/123 => /
      // ../../one, /a/b/c/d   => /a/b/one
      // .././one , /a/b/c/d   => /a/b/c/one
      const allSegments = baseSegments.concat(toSegments);
      const segments = [];

      allSegments.forEach(segment => {
        if (segment === "..") {
          segments.pop();
        } else if (segment !== ".") {
          segments.push(segment);
        }
      });

      return addQuery("/" + segments.join("/"), toQuery);
    }

    /**
     * Combines the `basepath` and the `path` into one path.
     * @param {string} basepath
     * @param {string} path
     */
    function combinePaths(basepath, path) {
      return `${stripSlashes(
    path === "/" ? basepath : `${stripSlashes(basepath)}/${stripSlashes(path)}`
  )}/`;
    }

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
      return (
        !event.defaultPrevented &&
        event.button === 0 &&
        !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
      );
    }

    function hostMatches(anchor) {
      const host = location.host;
      return (
        anchor.host == host ||
        // svelte seems to kill anchor.host value in ie11, so fall back to checking href
        anchor.href.indexOf(`https://${host}`) === 0 ||
        anchor.href.indexOf(`http://${host}`) === 0
      )
    }

    /* node_modules/svelte-routing/src/Router.svelte generated by Svelte v3.31.0 */

    function create_fragment(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
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
    	let $base;
    	let $location;
    	let $routes;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);
    	let { basepath = "/" } = $$props;
    	let { url = null } = $$props;
    	const locationContext = getContext(LOCATION);
    	const routerContext = getContext(ROUTER);
    	const routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(7, $routes = value));
    	const activeRoute = writable(null);
    	let hasActiveRoute = false; // Used in SSR to synchronously set that a Route is active.

    	// If locationContext is not set, this is the topmost Router in the tree.
    	// If the `url` prop is given we force the location to it.
    	const location = locationContext || writable(url ? { pathname: url } : globalHistory.location);

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(6, $location = value));

    	// If routerContext is set, the routerBase of the parent Router
    	// will be the base for this Router's descendants.
    	// If routerContext is not set, the path and resolved uri will both
    	// have the value of the basepath prop.
    	const base = routerContext
    	? routerContext.routerBase
    	: writable({ path: basepath, uri: basepath });

    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(5, $base = value));

    	const routerBase = derived([base, activeRoute], ([base, activeRoute]) => {
    		// If there is no activeRoute, the routerBase will be identical to the base.
    		if (activeRoute === null) {
    			return base;
    		}

    		const { path: basepath } = base;
    		const { route, uri } = activeRoute;

    		// Remove the potential /* or /*splatname from
    		// the end of the child Routes relative paths.
    		const path = route.default
    		? basepath
    		: route.path.replace(/\*.*$/, "");

    		return { path, uri };
    	});

    	function registerRoute(route) {
    		const { path: basepath } = $base;
    		let { path } = route;

    		// We store the original path in the _path property so we can reuse
    		// it when the basepath changes. The only thing that matters is that
    		// the route reference is intact, so mutation is fine.
    		route._path = path;

    		route.path = combinePaths(basepath, path);

    		if (typeof window === "undefined") {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			const matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				activeRoute.set(matchingRoute);
    				hasActiveRoute = true;
    			}
    		} else {
    			routes.update(rs => {
    				rs.push(route);
    				return rs;
    			});
    		}
    	}

    	function unregisterRoute(route) {
    		routes.update(rs => {
    			const index = rs.indexOf(route);
    			rs.splice(index, 1);
    			return rs;
    		});
    	}

    	if (!locationContext) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			const unlisten = globalHistory.listen(history => {
    				location.set(history.location);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute
    	});

    	const writable_props = ["basepath", "url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		derived,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		pick,
    		match,
    		stripSlashes,
    		combinePaths,
    		basepath,
    		url,
    		locationContext,
    		routerContext,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		location,
    		base,
    		routerBase,
    		registerRoute,
    		unregisterRoute,
    		$base,
    		$location,
    		$routes
    	});

    	$$self.$inject_state = $$props => {
    		if ("basepath" in $$props) $$invalidate(3, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(4, url = $$props.url);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$base*/ 32) {
    			// This reactive statement will update all the Routes' path when
    			// the basepath changes.
    			 {
    				const { path: basepath } = $base;

    				routes.update(rs => {
    					rs.forEach(r => r.path = combinePaths(basepath, r._path));
    					return rs;
    				});
    			}
    		}

    		if ($$self.$$.dirty & /*$routes, $location*/ 192) {
    			// This reactive statement will be run when the Router is created
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			 {
    				const bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			}
    		}
    	};

    	return [
    		routes,
    		location,
    		base,
    		basepath,
    		url,
    		$base,
    		$location,
    		$routes,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { basepath: 3, url: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Route.svelte generated by Svelte v3.31.0 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*routeParams*/ 4,
    	location: dirty & /*$location*/ 16
    });

    const get_default_slot_context = ctx => ({
    	params: /*routeParams*/ ctx[2],
    	location: /*$location*/ ctx[4]
    });

    // (40:0) {#if $activeRoute !== null && $activeRoute.route === route}
    function create_if_block(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(40:0) {#if $activeRoute !== null && $activeRoute.route === route}",
    		ctx
    	});

    	return block;
    }

    // (43:2) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, routeParams, $location*/ 532) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(43:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (41:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[4] },
    		/*routeParams*/ ctx[2],
    		/*routeProps*/ ctx[3]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*$location, routeParams, routeProps*/ 28)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 16 && { location: /*$location*/ ctx[4] },
    					dirty & /*routeParams*/ 4 && get_spread_object(/*routeParams*/ ctx[2]),
    					dirty & /*routeProps*/ 8 && get_spread_object(/*routeProps*/ ctx[3])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(41:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$activeRoute*/ ctx[1] !== null && /*$activeRoute*/ ctx[1].route === /*route*/ ctx[7]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$activeRoute*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
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

    function instance$1($$self, $$props, $$invalidate) {
    	let $activeRoute;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	let { path = "" } = $$props;
    	let { component = null } = $$props;
    	const { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(1, $activeRoute = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(4, $location = value));

    	const route = {
    		path,
    		// If no path prop is given, this Route will act as the default Route
    		// that is rendered if no other Route in the Router is a match.
    		default: path === ""
    	};

    	let routeParams = {};
    	let routeProps = {};
    	registerRoute(route);

    	// There is no need to unregister Routes in SSR since it will all be
    	// thrown away anyway.
    	if (typeof window !== "undefined") {
    		onDestroy(() => {
    			unregisterRoute(route);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("path" in $$new_props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("$$scope" in $$new_props) $$invalidate(9, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		onDestroy,
    		ROUTER,
    		LOCATION,
    		path,
    		component,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		location,
    		route,
    		routeParams,
    		routeProps,
    		$activeRoute,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(8, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("routeParams" in $$props) $$invalidate(2, routeParams = $$new_props.routeParams);
    		if ("routeProps" in $$props) $$invalidate(3, routeProps = $$new_props.routeProps);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$activeRoute*/ 2) {
    			 if ($activeRoute && $activeRoute.route === route) {
    				$$invalidate(2, routeParams = $activeRoute.params);
    			}
    		}

    		 {
    			const { path, component, ...rest } = $$props;
    			$$invalidate(3, routeProps = rest);
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		$activeRoute,
    		routeParams,
    		routeProps,
    		$location,
    		activeRoute,
    		location,
    		route,
    		path,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { path: 8, component: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-routing/src/Link.svelte generated by Svelte v3.31.0 */
    const file = "node_modules/svelte-routing/src/Link.svelte";

    function create_fragment$2(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let a_levels = [
    		{ href: /*href*/ ctx[0] },
    		{ "aria-current": /*ariaCurrent*/ ctx[2] },
    		/*props*/ ctx[1]
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file, 40, 0, 1249);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16384) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[14], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				(!current || dirty & /*ariaCurrent*/ 4) && { "aria-current": /*ariaCurrent*/ ctx[2] },
    				dirty & /*props*/ 2 && /*props*/ ctx[1]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
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
    	let $base;
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	let { to = "#" } = $$props;
    	let { replace = false } = $$props;
    	let { state = {} } = $$props;
    	let { getProps = () => ({}) } = $$props;
    	const { base } = getContext(ROUTER);
    	validate_store(base, "base");
    	component_subscribe($$self, base, value => $$invalidate(12, $base = value));
    	const location = getContext(LOCATION);
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(13, $location = value));
    	const dispatch = createEventDispatcher();
    	let href, isPartiallyCurrent, isCurrent, props;

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault();

    			// Don't push another entry to the history stack when the user
    			// clicks on a Link to the page they are currently on.
    			const shouldReplace = $location.pathname === href || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	const writable_props = ["to", "replace", "state", "getProps"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Link> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("$$scope" in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		getContext,
    		createEventDispatcher,
    		ROUTER,
    		LOCATION,
    		navigate,
    		startsWith,
    		resolve,
    		shouldNavigate,
    		to,
    		replace,
    		state,
    		getProps,
    		base,
    		location,
    		dispatch,
    		href,
    		isPartiallyCurrent,
    		isCurrent,
    		props,
    		onClick,
    		$base,
    		$location,
    		ariaCurrent
    	});

    	$$self.$inject_state = $$props => {
    		if ("to" in $$props) $$invalidate(6, to = $$props.to);
    		if ("replace" in $$props) $$invalidate(7, replace = $$props.replace);
    		if ("state" in $$props) $$invalidate(8, state = $$props.state);
    		if ("getProps" in $$props) $$invalidate(9, getProps = $$props.getProps);
    		if ("href" in $$props) $$invalidate(0, href = $$props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(10, isPartiallyCurrent = $$props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(11, isCurrent = $$props.isCurrent);
    		if ("props" in $$props) $$invalidate(1, props = $$props.props);
    		if ("ariaCurrent" in $$props) $$invalidate(2, ariaCurrent = $$props.ariaCurrent);
    	};

    	let ariaCurrent;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $base*/ 4160) {
    			 $$invalidate(0, href = to === "/" ? $base.uri : resolve(to, $base.uri));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 8193) {
    			 $$invalidate(10, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 8193) {
    			 $$invalidate(11, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 2048) {
    			 $$invalidate(2, ariaCurrent = isCurrent ? "page" : undefined);
    		}

    		if ($$self.$$.dirty & /*getProps, $location, href, isPartiallyCurrent, isCurrent*/ 11777) {
    			 $$invalidate(1, props = getProps({
    				location: $location,
    				href,
    				isPartiallyCurrent,
    				isCurrent
    			}));
    		}
    	};

    	return [
    		href,
    		props,
    		ariaCurrent,
    		base,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		isPartiallyCurrent,
    		isCurrent,
    		$base,
    		$location,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { to: 6, replace: 7, state: 8, getProps: 9 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * A link action that can be added to <a href=""> tags rather
     * than using the <Link> component.
     *
     * Example:
     * ```html
     * <a href="/post/{postId}" use:link>{post.title}</a>
     * ```
     */
    function link(node) {
      function onClick(event) {
        const anchor = event.currentTarget;

        if (
          anchor.target === "" &&
          hostMatches(anchor) &&
          shouldNavigate(event)
        ) {
          event.preventDefault();
          navigate(anchor.pathname + anchor.search, { replace: anchor.hasAttribute("replace") });
        }
      }

      node.addEventListener("click", onClick);

      return {
        destroy() {
          node.removeEventListener("click", onClick);
        }
      };
    }

    var bind = function bind(fn, thisArg) {
      return function wrap() {
        var args = new Array(arguments.length);
        for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i];
        }
        return fn.apply(thisArg, args);
      };
    };

    /*global toString:true*/

    // utils is a library of generic helper functions non-specific to axios

    var toString = Object.prototype.toString;

    /**
     * Determine if a value is an Array
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Array, otherwise false
     */
    function isArray(val) {
      return toString.call(val) === '[object Array]';
    }

    /**
     * Determine if a value is undefined
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if the value is undefined, otherwise false
     */
    function isUndefined(val) {
      return typeof val === 'undefined';
    }

    /**
     * Determine if a value is a Buffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Buffer, otherwise false
     */
    function isBuffer(val) {
      return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
        && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
    }

    /**
     * Determine if a value is an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an ArrayBuffer, otherwise false
     */
    function isArrayBuffer(val) {
      return toString.call(val) === '[object ArrayBuffer]';
    }

    /**
     * Determine if a value is a FormData
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an FormData, otherwise false
     */
    function isFormData(val) {
      return (typeof FormData !== 'undefined') && (val instanceof FormData);
    }

    /**
     * Determine if a value is a view on an ArrayBuffer
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
     */
    function isArrayBufferView(val) {
      var result;
      if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
        result = ArrayBuffer.isView(val);
      } else {
        result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
      }
      return result;
    }

    /**
     * Determine if a value is a String
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a String, otherwise false
     */
    function isString(val) {
      return typeof val === 'string';
    }

    /**
     * Determine if a value is a Number
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Number, otherwise false
     */
    function isNumber(val) {
      return typeof val === 'number';
    }

    /**
     * Determine if a value is an Object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is an Object, otherwise false
     */
    function isObject(val) {
      return val !== null && typeof val === 'object';
    }

    /**
     * Determine if a value is a plain Object
     *
     * @param {Object} val The value to test
     * @return {boolean} True if value is a plain Object, otherwise false
     */
    function isPlainObject(val) {
      if (toString.call(val) !== '[object Object]') {
        return false;
      }

      var prototype = Object.getPrototypeOf(val);
      return prototype === null || prototype === Object.prototype;
    }

    /**
     * Determine if a value is a Date
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Date, otherwise false
     */
    function isDate(val) {
      return toString.call(val) === '[object Date]';
    }

    /**
     * Determine if a value is a File
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a File, otherwise false
     */
    function isFile(val) {
      return toString.call(val) === '[object File]';
    }

    /**
     * Determine if a value is a Blob
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Blob, otherwise false
     */
    function isBlob(val) {
      return toString.call(val) === '[object Blob]';
    }

    /**
     * Determine if a value is a Function
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Function, otherwise false
     */
    function isFunction(val) {
      return toString.call(val) === '[object Function]';
    }

    /**
     * Determine if a value is a Stream
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a Stream, otherwise false
     */
    function isStream(val) {
      return isObject(val) && isFunction(val.pipe);
    }

    /**
     * Determine if a value is a URLSearchParams object
     *
     * @param {Object} val The value to test
     * @returns {boolean} True if value is a URLSearchParams object, otherwise false
     */
    function isURLSearchParams(val) {
      return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
    }

    /**
     * Trim excess whitespace off the beginning and end of a string
     *
     * @param {String} str The String to trim
     * @returns {String} The String freed of excess whitespace
     */
    function trim(str) {
      return str.replace(/^\s*/, '').replace(/\s*$/, '');
    }

    /**
     * Determine if we're running in a standard browser environment
     *
     * This allows axios to run in a web worker, and react-native.
     * Both environments support XMLHttpRequest, but not fully standard globals.
     *
     * web workers:
     *  typeof window -> undefined
     *  typeof document -> undefined
     *
     * react-native:
     *  navigator.product -> 'ReactNative'
     * nativescript
     *  navigator.product -> 'NativeScript' or 'NS'
     */
    function isStandardBrowserEnv() {
      if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                               navigator.product === 'NativeScript' ||
                                               navigator.product === 'NS')) {
        return false;
      }
      return (
        typeof window !== 'undefined' &&
        typeof document !== 'undefined'
      );
    }

    /**
     * Iterate over an Array or an Object invoking a function for each item.
     *
     * If `obj` is an Array callback will be called passing
     * the value, index, and complete array for each item.
     *
     * If 'obj' is an Object callback will be called passing
     * the value, key, and complete object for each property.
     *
     * @param {Object|Array} obj The object to iterate
     * @param {Function} fn The callback to invoke for each item
     */
    function forEach(obj, fn) {
      // Don't bother if no value provided
      if (obj === null || typeof obj === 'undefined') {
        return;
      }

      // Force an array if not already something iterable
      if (typeof obj !== 'object') {
        /*eslint no-param-reassign:0*/
        obj = [obj];
      }

      if (isArray(obj)) {
        // Iterate over array values
        for (var i = 0, l = obj.length; i < l; i++) {
          fn.call(null, obj[i], i, obj);
        }
      } else {
        // Iterate over object keys
        for (var key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            fn.call(null, obj[key], key, obj);
          }
        }
      }
    }

    /**
     * Accepts varargs expecting each argument to be an object, then
     * immutably merges the properties of each object and returns result.
     *
     * When multiple objects contain the same key the later object in
     * the arguments list will take precedence.
     *
     * Example:
     *
     * ```js
     * var result = merge({foo: 123}, {foo: 456});
     * console.log(result.foo); // outputs 456
     * ```
     *
     * @param {Object} obj1 Object to merge
     * @returns {Object} Result of all merge properties
     */
    function merge(/* obj1, obj2, obj3, ... */) {
      var result = {};
      function assignValue(val, key) {
        if (isPlainObject(result[key]) && isPlainObject(val)) {
          result[key] = merge(result[key], val);
        } else if (isPlainObject(val)) {
          result[key] = merge({}, val);
        } else if (isArray(val)) {
          result[key] = val.slice();
        } else {
          result[key] = val;
        }
      }

      for (var i = 0, l = arguments.length; i < l; i++) {
        forEach(arguments[i], assignValue);
      }
      return result;
    }

    /**
     * Extends object a by mutably adding to it the properties of object b.
     *
     * @param {Object} a The object to be extended
     * @param {Object} b The object to copy properties from
     * @param {Object} thisArg The object to bind function to
     * @return {Object} The resulting value of object a
     */
    function extend(a, b, thisArg) {
      forEach(b, function assignValue(val, key) {
        if (thisArg && typeof val === 'function') {
          a[key] = bind(val, thisArg);
        } else {
          a[key] = val;
        }
      });
      return a;
    }

    /**
     * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
     *
     * @param {string} content with BOM
     * @return {string} content value without BOM
     */
    function stripBOM(content) {
      if (content.charCodeAt(0) === 0xFEFF) {
        content = content.slice(1);
      }
      return content;
    }

    var utils = {
      isArray: isArray,
      isArrayBuffer: isArrayBuffer,
      isBuffer: isBuffer,
      isFormData: isFormData,
      isArrayBufferView: isArrayBufferView,
      isString: isString,
      isNumber: isNumber,
      isObject: isObject,
      isPlainObject: isPlainObject,
      isUndefined: isUndefined,
      isDate: isDate,
      isFile: isFile,
      isBlob: isBlob,
      isFunction: isFunction,
      isStream: isStream,
      isURLSearchParams: isURLSearchParams,
      isStandardBrowserEnv: isStandardBrowserEnv,
      forEach: forEach,
      merge: merge,
      extend: extend,
      trim: trim,
      stripBOM: stripBOM
    };

    function encode(val) {
      return encodeURIComponent(val).
        replace(/%3A/gi, ':').
        replace(/%24/g, '$').
        replace(/%2C/gi, ',').
        replace(/%20/g, '+').
        replace(/%5B/gi, '[').
        replace(/%5D/gi, ']');
    }

    /**
     * Build a URL by appending params to the end
     *
     * @param {string} url The base of the url (e.g., http://www.google.com)
     * @param {object} [params] The params to be appended
     * @returns {string} The formatted url
     */
    var buildURL = function buildURL(url, params, paramsSerializer) {
      /*eslint no-param-reassign:0*/
      if (!params) {
        return url;
      }

      var serializedParams;
      if (paramsSerializer) {
        serializedParams = paramsSerializer(params);
      } else if (utils.isURLSearchParams(params)) {
        serializedParams = params.toString();
      } else {
        var parts = [];

        utils.forEach(params, function serialize(val, key) {
          if (val === null || typeof val === 'undefined') {
            return;
          }

          if (utils.isArray(val)) {
            key = key + '[]';
          } else {
            val = [val];
          }

          utils.forEach(val, function parseValue(v) {
            if (utils.isDate(v)) {
              v = v.toISOString();
            } else if (utils.isObject(v)) {
              v = JSON.stringify(v);
            }
            parts.push(encode(key) + '=' + encode(v));
          });
        });

        serializedParams = parts.join('&');
      }

      if (serializedParams) {
        var hashmarkIndex = url.indexOf('#');
        if (hashmarkIndex !== -1) {
          url = url.slice(0, hashmarkIndex);
        }

        url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
      }

      return url;
    };

    function InterceptorManager() {
      this.handlers = [];
    }

    /**
     * Add a new interceptor to the stack
     *
     * @param {Function} fulfilled The function to handle `then` for a `Promise`
     * @param {Function} rejected The function to handle `reject` for a `Promise`
     *
     * @return {Number} An ID used to remove interceptor later
     */
    InterceptorManager.prototype.use = function use(fulfilled, rejected) {
      this.handlers.push({
        fulfilled: fulfilled,
        rejected: rejected
      });
      return this.handlers.length - 1;
    };

    /**
     * Remove an interceptor from the stack
     *
     * @param {Number} id The ID that was returned by `use`
     */
    InterceptorManager.prototype.eject = function eject(id) {
      if (this.handlers[id]) {
        this.handlers[id] = null;
      }
    };

    /**
     * Iterate over all the registered interceptors
     *
     * This method is particularly useful for skipping over any
     * interceptors that may have become `null` calling `eject`.
     *
     * @param {Function} fn The function to call for each interceptor
     */
    InterceptorManager.prototype.forEach = function forEach(fn) {
      utils.forEach(this.handlers, function forEachHandler(h) {
        if (h !== null) {
          fn(h);
        }
      });
    };

    var InterceptorManager_1 = InterceptorManager;

    /**
     * Transform the data for a request or a response
     *
     * @param {Object|String} data The data to be transformed
     * @param {Array} headers The headers for the request or response
     * @param {Array|Function} fns A single function or Array of functions
     * @returns {*} The resulting transformed data
     */
    var transformData = function transformData(data, headers, fns) {
      /*eslint no-param-reassign:0*/
      utils.forEach(fns, function transform(fn) {
        data = fn(data, headers);
      });

      return data;
    };

    var isCancel = function isCancel(value) {
      return !!(value && value.__CANCEL__);
    };

    var normalizeHeaderName = function normalizeHeaderName(headers, normalizedName) {
      utils.forEach(headers, function processHeader(value, name) {
        if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
          headers[normalizedName] = value;
          delete headers[name];
        }
      });
    };

    /**
     * Update an Error with the specified config, error code, and response.
     *
     * @param {Error} error The error to update.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The error.
     */
    var enhanceError = function enhanceError(error, config, code, request, response) {
      error.config = config;
      if (code) {
        error.code = code;
      }

      error.request = request;
      error.response = response;
      error.isAxiosError = true;

      error.toJSON = function toJSON() {
        return {
          // Standard
          message: this.message,
          name: this.name,
          // Microsoft
          description: this.description,
          number: this.number,
          // Mozilla
          fileName: this.fileName,
          lineNumber: this.lineNumber,
          columnNumber: this.columnNumber,
          stack: this.stack,
          // Axios
          config: this.config,
          code: this.code
        };
      };
      return error;
    };

    /**
     * Create an Error with the specified message, config, error code, request and response.
     *
     * @param {string} message The error message.
     * @param {Object} config The config.
     * @param {string} [code] The error code (for example, 'ECONNABORTED').
     * @param {Object} [request] The request.
     * @param {Object} [response] The response.
     * @returns {Error} The created error.
     */
    var createError = function createError(message, config, code, request, response) {
      var error = new Error(message);
      return enhanceError(error, config, code, request, response);
    };

    /**
     * Resolve or reject a Promise based on response status.
     *
     * @param {Function} resolve A function that resolves the promise.
     * @param {Function} reject A function that rejects the promise.
     * @param {object} response The response.
     */
    var settle = function settle(resolve, reject, response) {
      var validateStatus = response.config.validateStatus;
      if (!response.status || !validateStatus || validateStatus(response.status)) {
        resolve(response);
      } else {
        reject(createError(
          'Request failed with status code ' + response.status,
          response.config,
          null,
          response.request,
          response
        ));
      }
    };

    var cookies = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs support document.cookie
        (function standardBrowserEnv() {
          return {
            write: function write(name, value, expires, path, domain, secure) {
              var cookie = [];
              cookie.push(name + '=' + encodeURIComponent(value));

              if (utils.isNumber(expires)) {
                cookie.push('expires=' + new Date(expires).toGMTString());
              }

              if (utils.isString(path)) {
                cookie.push('path=' + path);
              }

              if (utils.isString(domain)) {
                cookie.push('domain=' + domain);
              }

              if (secure === true) {
                cookie.push('secure');
              }

              document.cookie = cookie.join('; ');
            },

            read: function read(name) {
              var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
              return (match ? decodeURIComponent(match[3]) : null);
            },

            remove: function remove(name) {
              this.write(name, '', Date.now() - 86400000);
            }
          };
        })() :

      // Non standard browser env (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return {
            write: function write() {},
            read: function read() { return null; },
            remove: function remove() {}
          };
        })()
    );

    /**
     * Determines whether the specified URL is absolute
     *
     * @param {string} url The URL to test
     * @returns {boolean} True if the specified URL is absolute, otherwise false
     */
    var isAbsoluteURL = function isAbsoluteURL(url) {
      // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
      // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
      // by any combination of letters, digits, plus, period, or hyphen.
      return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
    };

    /**
     * Creates a new URL by combining the specified URLs
     *
     * @param {string} baseURL The base URL
     * @param {string} relativeURL The relative URL
     * @returns {string} The combined URL
     */
    var combineURLs = function combineURLs(baseURL, relativeURL) {
      return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
    };

    /**
     * Creates a new URL by combining the baseURL with the requestedURL,
     * only when the requestedURL is not already an absolute URL.
     * If the requestURL is absolute, this function returns the requestedURL untouched.
     *
     * @param {string} baseURL The base URL
     * @param {string} requestedURL Absolute or relative URL to combine
     * @returns {string} The combined full path
     */
    var buildFullPath = function buildFullPath(baseURL, requestedURL) {
      if (baseURL && !isAbsoluteURL(requestedURL)) {
        return combineURLs(baseURL, requestedURL);
      }
      return requestedURL;
    };

    // Headers whose duplicates are ignored by node
    // c.f. https://nodejs.org/api/http.html#http_message_headers
    var ignoreDuplicateOf = [
      'age', 'authorization', 'content-length', 'content-type', 'etag',
      'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
      'last-modified', 'location', 'max-forwards', 'proxy-authorization',
      'referer', 'retry-after', 'user-agent'
    ];

    /**
     * Parse headers into an object
     *
     * ```
     * Date: Wed, 27 Aug 2014 08:58:49 GMT
     * Content-Type: application/json
     * Connection: keep-alive
     * Transfer-Encoding: chunked
     * ```
     *
     * @param {String} headers Headers needing to be parsed
     * @returns {Object} Headers parsed into an object
     */
    var parseHeaders = function parseHeaders(headers) {
      var parsed = {};
      var key;
      var val;
      var i;

      if (!headers) { return parsed; }

      utils.forEach(headers.split('\n'), function parser(line) {
        i = line.indexOf(':');
        key = utils.trim(line.substr(0, i)).toLowerCase();
        val = utils.trim(line.substr(i + 1));

        if (key) {
          if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
            return;
          }
          if (key === 'set-cookie') {
            parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
          } else {
            parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
          }
        }
      });

      return parsed;
    };

    var isURLSameOrigin = (
      utils.isStandardBrowserEnv() ?

      // Standard browser envs have full support of the APIs needed to test
      // whether the request URL is of the same origin as current location.
        (function standardBrowserEnv() {
          var msie = /(msie|trident)/i.test(navigator.userAgent);
          var urlParsingNode = document.createElement('a');
          var originURL;

          /**
        * Parse a URL to discover it's components
        *
        * @param {String} url The URL to be parsed
        * @returns {Object}
        */
          function resolveURL(url) {
            var href = url;

            if (msie) {
            // IE needs attribute set twice to normalize properties
              urlParsingNode.setAttribute('href', href);
              href = urlParsingNode.href;
            }

            urlParsingNode.setAttribute('href', href);

            // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
            return {
              href: urlParsingNode.href,
              protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
              host: urlParsingNode.host,
              search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
              hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
              hostname: urlParsingNode.hostname,
              port: urlParsingNode.port,
              pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                urlParsingNode.pathname :
                '/' + urlParsingNode.pathname
            };
          }

          originURL = resolveURL(window.location.href);

          /**
        * Determine if a URL shares the same origin as the current location
        *
        * @param {String} requestURL The URL to test
        * @returns {boolean} True if URL shares the same origin, otherwise false
        */
          return function isURLSameOrigin(requestURL) {
            var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
            return (parsed.protocol === originURL.protocol &&
                parsed.host === originURL.host);
          };
        })() :

      // Non standard browser envs (web workers, react-native) lack needed support.
        (function nonStandardBrowserEnv() {
          return function isURLSameOrigin() {
            return true;
          };
        })()
    );

    var xhr = function xhrAdapter(config) {
      return new Promise(function dispatchXhrRequest(resolve, reject) {
        var requestData = config.data;
        var requestHeaders = config.headers;

        if (utils.isFormData(requestData)) {
          delete requestHeaders['Content-Type']; // Let the browser set it
        }

        var request = new XMLHttpRequest();

        // HTTP basic authentication
        if (config.auth) {
          var username = config.auth.username || '';
          var password = config.auth.password ? unescape(encodeURIComponent(config.auth.password)) : '';
          requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
        }

        var fullPath = buildFullPath(config.baseURL, config.url);
        request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

        // Set the request timeout in MS
        request.timeout = config.timeout;

        // Listen for ready state
        request.onreadystatechange = function handleLoad() {
          if (!request || request.readyState !== 4) {
            return;
          }

          // The request errored out and we didn't get a response, this will be
          // handled by onerror instead
          // With one exception: request that using file: protocol, most browsers
          // will return status as 0 even though it's a successful request
          if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
            return;
          }

          // Prepare the response
          var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
          var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
          var response = {
            data: responseData,
            status: request.status,
            statusText: request.statusText,
            headers: responseHeaders,
            config: config,
            request: request
          };

          settle(resolve, reject, response);

          // Clean up request
          request = null;
        };

        // Handle browser request cancellation (as opposed to a manual cancellation)
        request.onabort = function handleAbort() {
          if (!request) {
            return;
          }

          reject(createError('Request aborted', config, 'ECONNABORTED', request));

          // Clean up request
          request = null;
        };

        // Handle low level network errors
        request.onerror = function handleError() {
          // Real errors are hidden from us by the browser
          // onerror should only fire if it's a network error
          reject(createError('Network Error', config, null, request));

          // Clean up request
          request = null;
        };

        // Handle timeout
        request.ontimeout = function handleTimeout() {
          var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
          if (config.timeoutErrorMessage) {
            timeoutErrorMessage = config.timeoutErrorMessage;
          }
          reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
            request));

          // Clean up request
          request = null;
        };

        // Add xsrf header
        // This is only done if running in a standard browser environment.
        // Specifically not if we're in a web worker, or react-native.
        if (utils.isStandardBrowserEnv()) {
          // Add xsrf header
          var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
            cookies.read(config.xsrfCookieName) :
            undefined;

          if (xsrfValue) {
            requestHeaders[config.xsrfHeaderName] = xsrfValue;
          }
        }

        // Add headers to the request
        if ('setRequestHeader' in request) {
          utils.forEach(requestHeaders, function setRequestHeader(val, key) {
            if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
              // Remove Content-Type if data is undefined
              delete requestHeaders[key];
            } else {
              // Otherwise add header to the request
              request.setRequestHeader(key, val);
            }
          });
        }

        // Add withCredentials to request if needed
        if (!utils.isUndefined(config.withCredentials)) {
          request.withCredentials = !!config.withCredentials;
        }

        // Add responseType to request if needed
        if (config.responseType) {
          try {
            request.responseType = config.responseType;
          } catch (e) {
            // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
            // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
            if (config.responseType !== 'json') {
              throw e;
            }
          }
        }

        // Handle progress if needed
        if (typeof config.onDownloadProgress === 'function') {
          request.addEventListener('progress', config.onDownloadProgress);
        }

        // Not all browsers support upload events
        if (typeof config.onUploadProgress === 'function' && request.upload) {
          request.upload.addEventListener('progress', config.onUploadProgress);
        }

        if (config.cancelToken) {
          // Handle cancellation
          config.cancelToken.promise.then(function onCanceled(cancel) {
            if (!request) {
              return;
            }

            request.abort();
            reject(cancel);
            // Clean up request
            request = null;
          });
        }

        if (!requestData) {
          requestData = null;
        }

        // Send the request
        request.send(requestData);
      });
    };

    var DEFAULT_CONTENT_TYPE = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };

    function setContentTypeIfUnset(headers, value) {
      if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
        headers['Content-Type'] = value;
      }
    }

    function getDefaultAdapter() {
      var adapter;
      if (typeof XMLHttpRequest !== 'undefined') {
        // For browsers use XHR adapter
        adapter = xhr;
      } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
        // For node use HTTP adapter
        adapter = xhr;
      }
      return adapter;
    }

    var defaults = {
      adapter: getDefaultAdapter(),

      transformRequest: [function transformRequest(data, headers) {
        normalizeHeaderName(headers, 'Accept');
        normalizeHeaderName(headers, 'Content-Type');
        if (utils.isFormData(data) ||
          utils.isArrayBuffer(data) ||
          utils.isBuffer(data) ||
          utils.isStream(data) ||
          utils.isFile(data) ||
          utils.isBlob(data)
        ) {
          return data;
        }
        if (utils.isArrayBufferView(data)) {
          return data.buffer;
        }
        if (utils.isURLSearchParams(data)) {
          setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
          return data.toString();
        }
        if (utils.isObject(data)) {
          setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
          return JSON.stringify(data);
        }
        return data;
      }],

      transformResponse: [function transformResponse(data) {
        /*eslint no-param-reassign:0*/
        if (typeof data === 'string') {
          try {
            data = JSON.parse(data);
          } catch (e) { /* Ignore */ }
        }
        return data;
      }],

      /**
       * A timeout in milliseconds to abort a request. If set to 0 (default) a
       * timeout is not created.
       */
      timeout: 0,

      xsrfCookieName: 'XSRF-TOKEN',
      xsrfHeaderName: 'X-XSRF-TOKEN',

      maxContentLength: -1,
      maxBodyLength: -1,

      validateStatus: function validateStatus(status) {
        return status >= 200 && status < 300;
      }
    };

    defaults.headers = {
      common: {
        'Accept': 'application/json, text/plain, */*'
      }
    };

    utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
      defaults.headers[method] = {};
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
    });

    var defaults_1 = defaults;

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    function throwIfCancellationRequested(config) {
      if (config.cancelToken) {
        config.cancelToken.throwIfRequested();
      }
    }

    /**
     * Dispatch a request to the server using the configured adapter.
     *
     * @param {object} config The config that is to be used for the request
     * @returns {Promise} The Promise to be fulfilled
     */
    var dispatchRequest = function dispatchRequest(config) {
      throwIfCancellationRequested(config);

      // Ensure headers exist
      config.headers = config.headers || {};

      // Transform request data
      config.data = transformData(
        config.data,
        config.headers,
        config.transformRequest
      );

      // Flatten headers
      config.headers = utils.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers
      );

      utils.forEach(
        ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
        function cleanHeaderConfig(method) {
          delete config.headers[method];
        }
      );

      var adapter = config.adapter || defaults_1.adapter;

      return adapter(config).then(function onAdapterResolution(response) {
        throwIfCancellationRequested(config);

        // Transform response data
        response.data = transformData(
          response.data,
          response.headers,
          config.transformResponse
        );

        return response;
      }, function onAdapterRejection(reason) {
        if (!isCancel(reason)) {
          throwIfCancellationRequested(config);

          // Transform response data
          if (reason && reason.response) {
            reason.response.data = transformData(
              reason.response.data,
              reason.response.headers,
              config.transformResponse
            );
          }
        }

        return Promise.reject(reason);
      });
    };

    /**
     * Config-specific merge-function which creates a new config-object
     * by merging two configuration objects together.
     *
     * @param {Object} config1
     * @param {Object} config2
     * @returns {Object} New object resulting from merging config2 to config1
     */
    var mergeConfig = function mergeConfig(config1, config2) {
      // eslint-disable-next-line no-param-reassign
      config2 = config2 || {};
      var config = {};

      var valueFromConfig2Keys = ['url', 'method', 'data'];
      var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy', 'params'];
      var defaultToConfig2Keys = [
        'baseURL', 'transformRequest', 'transformResponse', 'paramsSerializer',
        'timeout', 'timeoutMessage', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
        'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress', 'decompress',
        'maxContentLength', 'maxBodyLength', 'maxRedirects', 'transport', 'httpAgent',
        'httpsAgent', 'cancelToken', 'socketPath', 'responseEncoding'
      ];
      var directMergeKeys = ['validateStatus'];

      function getMergedValue(target, source) {
        if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
          return utils.merge(target, source);
        } else if (utils.isPlainObject(source)) {
          return utils.merge({}, source);
        } else if (utils.isArray(source)) {
          return source.slice();
        }
        return source;
      }

      function mergeDeepProperties(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      }

      utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        }
      });

      utils.forEach(mergeDeepPropertiesKeys, mergeDeepProperties);

      utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
        if (!utils.isUndefined(config2[prop])) {
          config[prop] = getMergedValue(undefined, config2[prop]);
        } else if (!utils.isUndefined(config1[prop])) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      utils.forEach(directMergeKeys, function merge(prop) {
        if (prop in config2) {
          config[prop] = getMergedValue(config1[prop], config2[prop]);
        } else if (prop in config1) {
          config[prop] = getMergedValue(undefined, config1[prop]);
        }
      });

      var axiosKeys = valueFromConfig2Keys
        .concat(mergeDeepPropertiesKeys)
        .concat(defaultToConfig2Keys)
        .concat(directMergeKeys);

      var otherKeys = Object
        .keys(config1)
        .concat(Object.keys(config2))
        .filter(function filterAxiosKeys(key) {
          return axiosKeys.indexOf(key) === -1;
        });

      utils.forEach(otherKeys, mergeDeepProperties);

      return config;
    };

    /**
     * Create a new instance of Axios
     *
     * @param {Object} instanceConfig The default config for the instance
     */
    function Axios(instanceConfig) {
      this.defaults = instanceConfig;
      this.interceptors = {
        request: new InterceptorManager_1(),
        response: new InterceptorManager_1()
      };
    }

    /**
     * Dispatch a request
     *
     * @param {Object} config The config specific for this request (merged with this.defaults)
     */
    Axios.prototype.request = function request(config) {
      /*eslint no-param-reassign:0*/
      // Allow for axios('example/url'[, config]) a la fetch API
      if (typeof config === 'string') {
        config = arguments[1] || {};
        config.url = arguments[0];
      } else {
        config = config || {};
      }

      config = mergeConfig(this.defaults, config);

      // Set config.method
      if (config.method) {
        config.method = config.method.toLowerCase();
      } else if (this.defaults.method) {
        config.method = this.defaults.method.toLowerCase();
      } else {
        config.method = 'get';
      }

      // Hook up interceptors middleware
      var chain = [dispatchRequest, undefined];
      var promise = Promise.resolve(config);

      this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
        chain.unshift(interceptor.fulfilled, interceptor.rejected);
      });

      this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
        chain.push(interceptor.fulfilled, interceptor.rejected);
      });

      while (chain.length) {
        promise = promise.then(chain.shift(), chain.shift());
      }

      return promise;
    };

    Axios.prototype.getUri = function getUri(config) {
      config = mergeConfig(this.defaults, config);
      return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
    };

    // Provide aliases for supported request methods
    utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: (config || {}).data
        }));
      };
    });

    utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
      /*eslint func-names:0*/
      Axios.prototype[method] = function(url, data, config) {
        return this.request(mergeConfig(config || {}, {
          method: method,
          url: url,
          data: data
        }));
      };
    });

    var Axios_1 = Axios;

    /**
     * A `Cancel` is an object that is thrown when an operation is canceled.
     *
     * @class
     * @param {string=} message The message.
     */
    function Cancel(message) {
      this.message = message;
    }

    Cancel.prototype.toString = function toString() {
      return 'Cancel' + (this.message ? ': ' + this.message : '');
    };

    Cancel.prototype.__CANCEL__ = true;

    var Cancel_1 = Cancel;

    /**
     * A `CancelToken` is an object that can be used to request cancellation of an operation.
     *
     * @class
     * @param {Function} executor The executor function.
     */
    function CancelToken(executor) {
      if (typeof executor !== 'function') {
        throw new TypeError('executor must be a function.');
      }

      var resolvePromise;
      this.promise = new Promise(function promiseExecutor(resolve) {
        resolvePromise = resolve;
      });

      var token = this;
      executor(function cancel(message) {
        if (token.reason) {
          // Cancellation has already been requested
          return;
        }

        token.reason = new Cancel_1(message);
        resolvePromise(token.reason);
      });
    }

    /**
     * Throws a `Cancel` if cancellation has been requested.
     */
    CancelToken.prototype.throwIfRequested = function throwIfRequested() {
      if (this.reason) {
        throw this.reason;
      }
    };

    /**
     * Returns an object that contains a new `CancelToken` and a function that, when called,
     * cancels the `CancelToken`.
     */
    CancelToken.source = function source() {
      var cancel;
      var token = new CancelToken(function executor(c) {
        cancel = c;
      });
      return {
        token: token,
        cancel: cancel
      };
    };

    var CancelToken_1 = CancelToken;

    /**
     * Syntactic sugar for invoking a function and expanding an array for arguments.
     *
     * Common use case would be to use `Function.prototype.apply`.
     *
     *  ```js
     *  function f(x, y, z) {}
     *  var args = [1, 2, 3];
     *  f.apply(null, args);
     *  ```
     *
     * With `spread` this example can be re-written.
     *
     *  ```js
     *  spread(function(x, y, z) {})([1, 2, 3]);
     *  ```
     *
     * @param {Function} callback
     * @returns {Function}
     */
    var spread = function spread(callback) {
      return function wrap(arr) {
        return callback.apply(null, arr);
      };
    };

    /**
     * Determines whether the payload is an error thrown by Axios
     *
     * @param {*} payload The value to test
     * @returns {boolean} True if the payload is an error thrown by Axios, otherwise false
     */
    var isAxiosError = function isAxiosError(payload) {
      return (typeof payload === 'object') && (payload.isAxiosError === true);
    };

    /**
     * Create an instance of Axios
     *
     * @param {Object} defaultConfig The default config for the instance
     * @return {Axios} A new instance of Axios
     */
    function createInstance(defaultConfig) {
      var context = new Axios_1(defaultConfig);
      var instance = bind(Axios_1.prototype.request, context);

      // Copy axios.prototype to instance
      utils.extend(instance, Axios_1.prototype, context);

      // Copy context to instance
      utils.extend(instance, context);

      return instance;
    }

    // Create the default instance to be exported
    var axios = createInstance(defaults_1);

    // Expose Axios class to allow class inheritance
    axios.Axios = Axios_1;

    // Factory for creating new instances
    axios.create = function create(instanceConfig) {
      return createInstance(mergeConfig(axios.defaults, instanceConfig));
    };

    // Expose Cancel & CancelToken
    axios.Cancel = Cancel_1;
    axios.CancelToken = CancelToken_1;
    axios.isCancel = isCancel;

    // Expose all/spread
    axios.all = function all(promises) {
      return Promise.all(promises);
    };
    axios.spread = spread;

    // Expose isAxiosError
    axios.isAxiosError = isAxiosError;

    var axios_1 = axios;

    // Allow use of default import syntax in TypeScript
    var _default = axios;
    axios_1.default = _default;

    var axios$1 = axios_1;

    var url = 'http://localhost:1337';

    let storeLocations = [];
    async function searchLocations(locations){
    	let response = await axios$1.get(`${url}/locations`).catch(error => console.log(error));
    	let data = response.data;

    	var date = new Date();

    	let day = date.getDay();

    	let today = date.toLocaleString('en-GB', {weekday:'long'}).toLowerCase();

    	let currentTime = date.toLocaleString('en-GB', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false});

    	let storeLocations = [];
    	let storeInfo;
    	for (let x = 0; x < locations.length; x++){
    		storeInfo = data.filter(item => item.store_id == locations[x].store_id);
    		let basketPrice = {basketPrice: locations[x].basketPrice};
    		storeLocations.push({
    			...storeInfo,
    			...basketPrice
    		});

    		// console.log(storeInfo.push(basketPrice))
    		// storeLocations.push(storeInfo)
    		// storeLocations.basketPrice  = locations[x].basketPrice
    		// console.log(newObject)
    	}

    	//Opening days filter
    	storeLocations = storeLocations.filter((item) => item[0].days_open[today] === true);

    	// Opening hours filter CURRENTLY DOESN'T HANDLE PAST MIDNIGHT
    	storeLocations = storeLocations.filter((item)=> item[0].opens < currentTime && item[0].closes > currentTime);


    		return storeLocations.flat()
    }

    async function searchInventories(ingredient_id){
    	// gets data
    	let response = await axios$1.get(`${url}/inventories`).catch(error => console.log(error));
    	let data = response.data;
    	let stores = []; 
    	let filteredData = [];

    	//filters data for each id in ingredient_id
    	for (let x = 0; x < ingredient_id.length; x++){
    		filteredData.push(data.filter(item => item.ingredient_id == ingredient_id[x] && item.status == true));
    	}

    	//flattens all data recieved and deletes duplicate stores
    	//flattens data
    	let flat = filteredData.flat();


    	//counts store appearances
    	const counts = flat.reduce((c, v) => {
      	c[v.store_id] = (c[v.store_id] || 0) + 1;
     	 return c;
    	}, {});

    	//counts items searched
    	const x = filteredData.length;

    	//filters for inventories that match every item searched
    	let result = flat.filter(v => counts[v.store_id] == x);

    	//Deleted duplicate inventories add prices
    	// result = result.reduce((items, item) => items.find(x => x.store_id === item.store_id) ? [...items] : [...items, item], [])
    	result = Object.values(result.reduce((acc,item) => {
    	 	const { store_id } = item;
    		const prev = acc[store_id];
    		acc[store_id] = prev ? { ...prev, total_price: prev.price+item.price } : {...item};
    		return acc;
    		}, {}));

    	if (result.length == 0) { 
    		console.log('no stores have this in stock');
    	} else {
    		let storePrices = [];
    		for (let i = 0; i <result.length; i++){
    			if (result[i].total_price){
    			storePrices.push({store_id: result[i].store_id, basketPrice: result[i].total_price});
    		} else {
    			storePrices.push({store_id: result[i].store_id, basketPrice: result[i].price});
    		}
    	}

    		// let locations = result.map(item => item.store_id)
    		// console.log(locations)
    		stores = searchLocations(storePrices);
    	}
    	return stores
    }

    // OLD CODE BEFORE MULTIPLE INPUTS
    // let response = await axios.get(`${url}/inventories`).catch(error => console.log(error))
    // 	let data = response.data
    // 	let stores = [] 
    // 	let filteredData = []
    // 	filteredData = data.filter(item => item.ingredient_id == ingredient_id && item.status == true)
    // 	if (filteredData.length == 0){ 
    // 		console.log('no stores have this in stock')
    // 	} else {
    // 		let locations = filteredData.map(item => item.store_id)
    // 		stores = searchLocations(locations)
    // 	}
    // 	console.log(stores)
    // 	return stores
    // }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn, basedir, module) {
    	return module = {
    		path: basedir,
    		exports: {},
    		require: function (path, base) {
    			return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    		}
    	}, fn(module, module.exports), module.exports;
    }

    function commonjsRequire () {
    	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
    }

    var fuzzball_umd_min = createCommonjsModule(function (module, exports) {
    (function(f){{module.exports=f();}})(function(){return function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof commonjsRequire=="function"&&commonjsRequire;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r);}return n[o].exports}var i=typeof commonjsRequire=="function"&&commonjsRequire;for(var o=0;o<r.length;o++)s(r[o]);return s}return e}()({1:[function(require,module,exports){(function(){var SequenceMatcher=require("./lib/fbdifflib.js");var Heap=require("heap");var _intersect=require("./lib/lodash.custom.min.js").intersection;var _intersectWith=require("./lib/lodash.custom.min.js").intersectionWith;var _difference=require("./lib/lodash.custom.min.js").difference;var _differenceWith=require("./lib/lodash.custom.min.js").differenceWith;var _uniq=require("./lib/lodash.custom.min.js").uniq;var _uniqWith=require("./lib/lodash.custom.min.js").uniqWith;var _partialRight=require("./lib/lodash.custom.min.js").partialRight;var _forEach=require("./lib/lodash.custom.min.js").forEach;var _keys=require("./lib/lodash.custom.min.js").keys;var _isArray=require("./lib/lodash.custom.min.js").isArray;var _toArray=require("./lib/lodash.custom.min.js").toArray;var iLeven=require("./lib/iLeven.js");var wildleven=require("./lib/wildcardLeven.js");var leven=require("./lib/leven.js");if(typeof setImmediate!=="function")require("setimmediate");var utils=require("./lib/utils.js")(_uniq,_uniqWith,_partialRight);var validate=utils.validate;var process_and_sort=utils.process_and_sort;var tokenize=utils.tokenize;var full_process=utils.full_process;var clone_and_set_option_defaults=utils.clone_and_set_option_defaults;var isCustomFunc=utils.isCustomFunc;var processing=require("./lib/process.js")(clone_and_set_option_defaults,_isArray,QRatio,extract);var dedupe=processing.dedupe;function distance(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(typeof options.subcost==="undefined")options.subcost=1;if(options.astral)return iLeven(str1,str2,options,_toArray);else return wildleven(str1,str2,options,leven)}function QRatio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(!validate(str1))return 0;if(!validate(str2))return 0;return _ratio(str1,str2,options)}function partial_ratio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(!validate(str1))return 0;if(!validate(str2))return 0;return _partial_ratio(str1,str2,options)}function token_set_ratio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(!validate(str1))return 0;if(!validate(str2))return 0;return _token_set(str1,str2,options)}function partial_token_set_ratio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(!validate(str1))return 0;if(!validate(str2))return 0;options.partial=true;return _token_set(str1,str2,options)}function token_sort_ratio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(!validate(str1))return 0;if(!validate(str2))return 0;if(!options.proc_sorted){str1=process_and_sort(str1);str2=process_and_sort(str2);}return _ratio(str1,str2,options)}function partial_token_sort_ratio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;if(!validate(str1))return 0;if(!validate(str2))return 0;options.partial=true;if(!options.proc_sorted){str1=process_and_sort(str1);str2=process_and_sort(str2);}return _partial_ratio(str1,str2,options)}function WRatio(str1,str2,options_p){var options=clone_and_set_option_defaults(options_p);str1=options.full_process?full_process(str1,options):str1;str2=options.full_process?full_process(str2,options):str2;options.full_process=false;if(!validate(str1))return 0;if(!validate(str2))return 0;var try_partial=true;var unbase_scale=.95;var partial_scale=.9;var base=_ratio(str1,str2,options);var len_ratio=Math.max(str1.length,str2.length)/Math.min(str1.length,str2.length);if(len_ratio<1.5)try_partial=false;if(len_ratio>8)partial_scale=.6;if(try_partial){var partial=_partial_ratio(str1,str2,options)*partial_scale;var ptsor=partial_token_sort_ratio(str1,str2,options)*unbase_scale*partial_scale;var ptser=partial_token_set_ratio(str1,str2,options)*unbase_scale*partial_scale;return Math.round(Math.max(base,partial,ptsor,ptser))}else {var tsor=token_sort_ratio(str1,str2,options)*unbase_scale;var tser=token_set_ratio(str1,str2,options)*unbase_scale;return Math.round(Math.max(base,tsor,tser))}}function extract(query,choices,options_p){var options=clone_and_set_option_defaults(options_p);var numchoices;if(_isArray(choices)){numchoices=choices.length;}else if(!(choices instanceof Object)){throw new Error("Invalid choices")}else numchoices=_keys(choices).length;if(!choices||numchoices===0){if(typeof console!==undefined)console.warn("No choices");return []}if(options.processor&&typeof options.processor!=="function"){throw new Error("Invalid Processor")}if(!options.processor)options.processor=function(x){return x};if(options.scorer&&typeof options.scorer!=="function"){throw new Error("Invalid Scorer")}if(!options.scorer){options.scorer=QRatio;}var isCustom=isCustomFunc(options.scorer);if(!options.cutoff||typeof options.cutoff!=="number"){options.cutoff=-1;}var pre_processor=function(choice,force_ascii){return choice};if(options.full_process){pre_processor=full_process;if(!isCustom)options.processed=true;}var normalize=false;if(!isCustom){query=pre_processor(query,options);options.full_process=false;if(options.astral&&options.normalize){options.normalize=false;if(String.prototype.normalize){normalize=true;query=query.normalize();}else {if(typeof console!==undefined)console.warn("Normalization not supported in your environment");}}if(query.length===0)if(typeof console!==undefined)console.warn("Processed query is empty string");}var results=[];var anyblank=false;var tsort=false;var tset=false;if(options.scorer.name==="token_sort_ratio"||options.scorer.name==="partial_token_sort_ratio"){var proc_sorted_query=process_and_sort(query);tsort=true;}else if(options.scorer.name==="token_set_ratio"||options.scorer.name==="partial_token_set_ratio"){var query_tokens=tokenize(query,options);tset=true;}var result,mychoice,cmpHeap,cmpSort;if(options.returnObjects){cmpHeap=function(a,b){return a.score-b.score};cmpSort=function(a,b){return b.score-a.score};}else {cmpHeap=function(a,b){return a[1]-b[1]};cmpSort=function(a,b){return b[1]-a[1]};}_forEach(choices,function(value,key){options.tokens=undefined;options.proc_sorted=false;if(tsort){options.proc_sorted=true;if(value&&value.proc_sorted)mychoice=value.proc_sorted;else {mychoice=pre_processor(options.processor(value),options);mychoice=process_and_sort(normalize?mychoice.normalize():mychoice);}result=options.scorer(proc_sorted_query,mychoice,options);}else if(tset){mychoice="x";if(value&&value.tokens){options.tokens=[query_tokens,value.tokens];if(options.trySimple)mychoice=pre_processor(options.processor(value),options);}else {mychoice=pre_processor(options.processor(value),options);options.tokens=[query_tokens,tokenize(normalize?mychoice.normalize():mychoice,options)];}result=options.scorer(query,mychoice,options);}else if(isCustom){mychoice=options.processor(value);result=options.scorer(query,mychoice,options);}else {mychoice=pre_processor(options.processor(value),options);if(typeof mychoice!=="string"||mychoice.length===0)anyblank=true;if(normalize&&typeof mychoice==="string")mychoice=mychoice.normalize();result=options.scorer(query,mychoice,options);}if(result>options.cutoff){if(options.returnObjects)results.push({choice:value,score:result,key:key});else results.push([value,result,key]);}});if(anyblank)if(typeof console!==undefined)console.log("One or more choices were empty. (post-processing if applied)");if(options.limit&&typeof options.limit==="number"&&options.limit>0&&options.limit<numchoices&&!options.unsorted){results=Heap.nlargest(results,options.limit,cmpHeap);}else if(!options.unsorted){results=results.sort(cmpSort);}return results}function extractAsync(query,choices,options_p,callback){var options=clone_and_set_option_defaults(options_p);var cancelToken;if(typeof options_p.cancelToken==="object"){cancelToken=options_p.cancelToken;}var loopOffset=256;if(typeof options.asyncLoopOffset==="number"){if(options.asyncLoopOffset<1)loopOffset=1;else loopOffset=options.asyncLoopOffset;}var isArray=false;var numchoices;if(choices&&choices.length&&_isArray(choices)){numchoices=choices.length;isArray=true;}else if(!(choices instanceof Object)){callback(new Error("Invalid choices"));return}else numchoices=Object.keys(choices).length;if(!choices||numchoices===0){if(typeof console!==undefined)console.warn("No choices");callback(null,[]);return}if(options.processor&&typeof options.processor!=="function"){callback(new Error("Invalid Processor"));return}if(!options.processor)options.processor=function(x){return x};if(options.scorer&&typeof options.scorer!=="function"){callback(new Error("Invalid Scorer"));return}if(!options.scorer){options.scorer=QRatio;}var isCustom=isCustomFunc(options.scorer);if(!options.cutoff||typeof options.cutoff!=="number"){options.cutoff=-1;}var pre_processor=function(choice,force_ascii){return choice};if(options.full_process){pre_processor=full_process;if(!isCustom)options.processed=true;}var normalize=false;if(!isCustom){query=pre_processor(query,options);options.full_process=false;if(options.astral&&options.normalize){options.normalize=false;if(String.prototype.normalize){normalize=true;query=query.normalize();}else {if(typeof console!==undefined)console.warn("Normalization not supported in your environment");}}if(query.length===0)if(typeof console!==undefined)console.warn("Processed query is empty string");}var results=[];var anyblank=false;var tsort=false;var tset=false;if(options.scorer.name==="token_sort_ratio"||options.scorer.name==="partial_token_sort_ratio"){var proc_sorted_query=process_and_sort(query);tsort=true;}else if(options.scorer.name==="token_set_ratio"||options.scorer.name==="partial_token_set_ratio"){var query_tokens=tokenize(query,options);tset=true;}var idx,mychoice,result,cmpHeap,cmpSort;if(options.returnObjects){cmpHeap=function(a,b){return a.score-b.score};cmpSort=function(a,b){return b.score-a.score};}else {cmpHeap=function(a,b){return a[1]-b[1]};cmpSort=function(a,b){return b[1]-a[1]};}var keys=Object.keys(choices);isArray?searchLoop(0):searchLoop(keys[0],0);function searchLoop(c,i){if(isArray||choices.hasOwnProperty(c)){options.tokens=undefined;options.proc_sorted=false;if(tsort){options.proc_sorted=true;if(choices[c]&&choices[c].proc_sorted)mychoice=choices[c].proc_sorted;else {mychoice=pre_processor(options.processor(choices[c]),options);mychoice=process_and_sort(normalize?mychoice.normalize():mychoice);}result=options.scorer(proc_sorted_query,mychoice,options);}else if(tset){mychoice="x";if(choices[c]&&choices[c].tokens){options.tokens=[query_tokens,choices[c].tokens];if(options.trySimple)mychoice=pre_processor(options.processor(choices[c]),options);}else {mychoice=pre_processor(options.processor(choices[c]),options);options.tokens=[query_tokens,tokenize(normalize?mychoice.normalize():mychoice,options)];}result=options.scorer(query,mychoice,options);}else if(isCustom){mychoice=options.processor(choices[c]);result=options.scorer(query,mychoice,options);}else {mychoice=pre_processor(options.processor(choices[c]),options);if(typeof mychoice!=="string"||mychoice.length===0)anyblank=true;if(normalize&&typeof mychoice==="string")mychoice=mychoice.normalize();result=options.scorer(query,mychoice,options);}if(isArray)idx=parseInt(c);else idx=c;if(result>options.cutoff){if(options.returnObjects)results.push({choice:choices[c],score:result,key:idx});else results.push([choices[c],result,idx]);}}if(cancelToken&&cancelToken.canceled===true){callback(new Error("canceled"));return}if(isArray&&c<choices.length-1){if(c%loopOffset===0){setImmediate(function(){searchLoop(c+1);});}else {searchLoop(c+1);}}else if(i<keys.length-1){if(i%loopOffset===0){setImmediate(function(){searchLoop(keys[i+1],i+1);});}else {searchLoop(keys[i+1],i+1);}}else {if(anyblank)if(typeof console!==undefined)console.log("One or more choices were empty. (post-processing if applied)");if(options.limit&&typeof options.limit==="number"&&options.limit>0&&options.limit<numchoices&&!options.unsorted){results=Heap.nlargest(results,options.limit,cmpHeap);}else if(!options.unsorted){results=results.sort(cmpSort);}callback(null,results);}}}function _token_set(str1,str2,options){if(!options.tokens){var tokens1=tokenize(str1,options);var tokens2=tokenize(str2,options);}else {var tokens1=options.tokens[0];var tokens2=options.tokens[1];}if(options.wildcards){var partWild=_partialRight(wildleven,options,leven);var wildCompare=function(a,b){return partWild(a,b)===0};var intersection=_intersectWith(tokens1,tokens2,wildCompare);var diff1to2=_differenceWith(tokens1,tokens2,wildCompare);var diff2to1=_differenceWith(tokens2,tokens1,wildCompare);}else {var intersection=_intersect(tokens1,tokens2);var diff1to2=_difference(tokens1,tokens2);var diff2to1=_difference(tokens2,tokens1);}var sorted_sect=intersection.sort().join(" ");var sorted_1to2=diff1to2.sort().join(" ");var sorted_2to1=diff2to1.sort().join(" ");var combined_1to2=sorted_sect+" "+sorted_1to2;var combined_2to1=sorted_sect+" "+sorted_2to1;sorted_sect=sorted_sect.trim();combined_1to2=combined_1to2.trim();combined_2to1=combined_2to1.trim();var ratio_func=_ratio;if(options.partial){ratio_func=_partial_ratio;if(sorted_sect.length>0)return 100}var pairwise=[ratio_func(sorted_sect,combined_1to2,options),ratio_func(sorted_sect,combined_2to1,options),ratio_func(combined_1to2,combined_2to1,options)];if(options.trySimple){pairwise.push(ratio_func(str1,str2,options));}return Math.max.apply(null,pairwise)}var normalWarn=false;function _ratio(str1,str2,options){if(!validate(str1))return 0;if(!validate(str2))return 0;if(options.ratio_alg&&options.ratio_alg==="difflib"){var m=new SequenceMatcher(null,str1,str2);var r=m.ratio();return Math.round(100*r)}if(typeof options.subcost==="undefined")options.subcost=2;var levdistance,lensum;if(options.astral){if(options.normalize){if(String.prototype.normalize){str1=str1.normalize();str2=str2.normalize();}else {if(!normalWarn){if(typeof console!==undefined)console.warn("Normalization not supported in your environment");normalWarn=true;}}}levdistance=iLeven(str1,str2,options,_toArray);lensum=_toArray(str1).length+_toArray(str2).length;}else {if(!options.wildcards){levdistance=leven(str1,str2,options);lensum=str1.length+str2.length;}else {levdistance=wildleven(str1,str2,options,leven);lensum=str1.length+str2.length;}}return Math.round(100*((lensum-levdistance)/lensum))}function _partial_ratio(str1,str2,options){if(!validate(str1))return 0;if(!validate(str2))return 0;if(str1.length<=str2.length){var shorter=str1;var longer=str2;}else {var shorter=str2;var longer=str1;}var m=new SequenceMatcher(null,shorter,longer);var blocks=m.getMatchingBlocks();var scores=[];for(var b=0;b<blocks.length;b++){var long_start=blocks[b][1]-blocks[b][0]>0?blocks[b][1]-blocks[b][0]:0;var long_end=long_start+shorter.length;var long_substr=longer.substring(long_start,long_end);var r=_ratio(shorter,long_substr,options);if(r>99.5)return 100;else scores.push(r);}return Math.max.apply(null,scores)}if(!Object.keys){Object.keys=function(){var hasOwnProperty=Object.prototype.hasOwnProperty,hasDontEnumBug=!{toString:null}.propertyIsEnumerable("toString"),dontEnums=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],dontEnumsLength=dontEnums.length;return function(obj){if(typeof obj!=="object"&&(typeof obj!=="function"||obj===null)){throw new TypeError("Object.keys called on non-object")}var result=[],prop,i;for(prop in obj){if(hasOwnProperty.call(obj,prop)){result.push(prop);}}if(hasDontEnumBug){for(i=0;i<dontEnumsLength;i++){if(hasOwnProperty.call(obj,dontEnums[i])){result.push(dontEnums[i]);}}}return result}}();}var extractAsPromised=undefined;if(typeof Promise!=="undefined"){extractAsPromised=function(query,choices,options){return new Promise(function(resolve,reject){extractAsync(query,choices,options,function(err,response){if(err)reject(err);else resolve(response);});})};}var fuzzball={distance:distance,ratio:QRatio,partial_ratio:partial_ratio,token_set_ratio:token_set_ratio,token_sort_ratio:token_sort_ratio,partial_token_set_ratio:partial_token_set_ratio,partial_token_sort_ratio:partial_token_sort_ratio,WRatio:WRatio,full_process:full_process,extract:extract,extractAsync:extractAsync,extractAsPromised:extractAsPromised,process_and_sort:process_and_sort,unique_tokens:tokenize,dedupe:dedupe};module.exports=fuzzball;})();},{"./lib/fbdifflib.js":2,"./lib/iLeven.js":3,"./lib/leven.js":4,"./lib/lodash.custom.min.js":5,"./lib/process.js":6,"./lib/utils.js":7,"./lib/wildcardLeven.js":8,heap:13,setimmediate:16}],2:[function(require,module,exports){var floor=Math.floor,max=Math.max,min=Math.min;var _calculateRatio=function(matches,length){if(length){return 2*matches/length}else {return 1}};var _arrayCmp=function(a,b){var i,la,lb,_i,_ref,_ref1;_ref=[a.length,b.length],la=_ref[0],lb=_ref[1];for(i=_i=0,_ref1=min(la,lb);0<=_ref1?_i<_ref1:_i>_ref1;i=0<=_ref1?++_i:--_i){if(a[i]<b[i]){return -1}if(a[i]>b[i]){return 1}}return la-lb};var _has=function(obj,key){return Object.prototype.hasOwnProperty.call(obj,key)};var SequenceMatcher=function(){function SequenceMatcher(isjunk,a,b,autojunk){this.isjunk=isjunk;if(a==null){a="";}if(b==null){b="";}this.autojunk=autojunk!=null?autojunk:true;this.a=this.b=null;this.setSeqs(a,b);}SequenceMatcher.prototype.setSeqs=function(a,b){this.setSeq1(a);return this.setSeq2(b)};SequenceMatcher.prototype.setSeq1=function(a){if(a===this.a){return}this.a=a;return this.matchingBlocks=this.opcodes=null};SequenceMatcher.prototype.setSeq2=function(b){if(b===this.b){return}this.b=b;this.matchingBlocks=this.opcodes=null;this.fullbcount=null;return this._chainB()};SequenceMatcher.prototype._chainB=function(){var b,b2j,elt,i,idxs,indices,isjunk,junk,n,ntest,popular,_i,_j,_len,_len1,_ref;b=this.b;this.b2j=b2j={};for(i=_i=0,_len=b.length;_i<_len;i=++_i){elt=b[i];indices=_has(b2j,elt)?b2j[elt]:b2j[elt]=[];indices.push(i);}junk={};isjunk=this.isjunk;if(isjunk){_ref=Object.keys(b2j);for(_j=0,_len1=_ref.length;_j<_len1;_j++){elt=_ref[_j];if(isjunk(elt)){junk[elt]=true;delete b2j[elt];}}}popular={};n=b.length;if(this.autojunk&&n>=200){ntest=floor(n/100)+1;for(elt in b2j){idxs=b2j[elt];if(idxs.length>ntest){popular[elt]=true;delete b2j[elt];}}}this.isbjunk=function(b){return _has(junk,b)};return this.isbpopular=function(b){return _has(popular,b)}};SequenceMatcher.prototype.findLongestMatch=function(alo,ahi,blo,bhi){var a,b,b2j,besti,bestj,bestsize,i,isbjunk,j,j2len,k,newj2len,_i,_j,_len,_ref,_ref1,_ref2,_ref3,_ref4,_ref5;_ref=[this.a,this.b,this.b2j,this.isbjunk],a=_ref[0],b=_ref[1],b2j=_ref[2],isbjunk=_ref[3];_ref1=[alo,blo,0],besti=_ref1[0],bestj=_ref1[1],bestsize=_ref1[2];j2len={};for(i=_i=alo;alo<=ahi?_i<ahi:_i>ahi;i=alo<=ahi?++_i:--_i){newj2len={};_ref2=_has(b2j,a[i])?b2j[a[i]]:[];for(_j=0,_len=_ref2.length;_j<_len;_j++){j=_ref2[_j];if(j<blo){continue}if(j>=bhi){break}k=newj2len[j]=(j2len[j-1]||0)+1;if(k>bestsize){_ref3=[i-k+1,j-k+1,k],besti=_ref3[0],bestj=_ref3[1],bestsize=_ref3[2];}}j2len=newj2len;}while(besti>alo&&bestj>blo&&!isbjunk(b[bestj-1])&&a[besti-1]===b[bestj-1]){_ref4=[besti-1,bestj-1,bestsize+1],besti=_ref4[0],bestj=_ref4[1],bestsize=_ref4[2];}while(besti+bestsize<ahi&&bestj+bestsize<bhi&&!isbjunk(b[bestj+bestsize])&&a[besti+bestsize]===b[bestj+bestsize]){bestsize++;}while(besti>alo&&bestj>blo&&isbjunk(b[bestj-1])&&a[besti-1]===b[bestj-1]){_ref5=[besti-1,bestj-1,bestsize+1],besti=_ref5[0],bestj=_ref5[1],bestsize=_ref5[2];}while(besti+bestsize<ahi&&bestj+bestsize<bhi&&isbjunk(b[bestj+bestsize])&&a[besti+bestsize]===b[bestj+bestsize]){bestsize++;}return [besti,bestj,bestsize]};SequenceMatcher.prototype.getMatchingBlocks=function(){var ahi,alo,bhi,blo,i,i1,i2,j,j1,j2,k,k1,k2,la,lb,matchingBlocks,nonAdjacent,queue,x,_i,_len,_ref,_ref1,_ref2,_ref3,_ref4;if(this.matchingBlocks){return this.matchingBlocks}_ref=[this.a.length,this.b.length],la=_ref[0],lb=_ref[1];queue=[[0,la,0,lb]];matchingBlocks=[];while(queue.length){_ref1=queue.pop(),alo=_ref1[0],ahi=_ref1[1],blo=_ref1[2],bhi=_ref1[3];_ref2=x=this.findLongestMatch(alo,ahi,blo,bhi),i=_ref2[0],j=_ref2[1],k=_ref2[2];if(k){matchingBlocks.push(x);if(alo<i&&blo<j){queue.push([alo,i,blo,j]);}if(i+k<ahi&&j+k<bhi){queue.push([i+k,ahi,j+k,bhi]);}}}matchingBlocks.sort(_arrayCmp);i1=j1=k1=0;nonAdjacent=[];for(_i=0,_len=matchingBlocks.length;_i<_len;_i++){_ref3=matchingBlocks[_i],i2=_ref3[0],j2=_ref3[1],k2=_ref3[2];if(i1+k1===i2&&j1+k1===j2){k1+=k2;}else {if(k1){nonAdjacent.push([i1,j1,k1]);}_ref4=[i2,j2,k2],i1=_ref4[0],j1=_ref4[1],k1=_ref4[2];}}if(k1){nonAdjacent.push([i1,j1,k1]);}nonAdjacent.push([la,lb,0]);return this.matchingBlocks=nonAdjacent};SequenceMatcher.prototype.getOpcodes=function(){var ai,answer,bj,i,j,size,tag,_i,_len,_ref,_ref1,_ref2;if(this.opcodes){return this.opcodes}i=j=0;this.opcodes=answer=[];_ref=this.getMatchingBlocks();for(_i=0,_len=_ref.length;_i<_len;_i++){_ref1=_ref[_i],ai=_ref1[0],bj=_ref1[1],size=_ref1[2];tag="";if(i<ai&&j<bj){tag="replace";}else if(i<ai){tag="delete";}else if(j<bj){tag="insert";}if(tag){answer.push([tag,i,ai,j,bj]);}_ref2=[ai+size,bj+size],i=_ref2[0],j=_ref2[1];if(size){answer.push(["equal",ai,i,bj,j]);}}return answer};SequenceMatcher.prototype.getGroupedOpcodes=function(n){var codes,group,groups,i1,i2,j1,j2,nn,tag,_i,_len,_ref,_ref1,_ref2,_ref3;if(n==null){n=3;}codes=this.getOpcodes();if(!codes.length){codes=[["equal",0,1,0,1]];}if(codes[0][0]==="equal"){_ref=codes[0],tag=_ref[0],i1=_ref[1],i2=_ref[2],j1=_ref[3],j2=_ref[4];codes[0]=[tag,max(i1,i2-n),i2,max(j1,j2-n),j2];}if(codes[codes.length-1][0]==="equal"){_ref1=codes[codes.length-1],tag=_ref1[0],i1=_ref1[1],i2=_ref1[2],j1=_ref1[3],j2=_ref1[4];codes[codes.length-1]=[tag,i1,min(i2,i1+n),j1,min(j2,j1+n)];}nn=n+n;groups=[];group=[];for(_i=0,_len=codes.length;_i<_len;_i++){_ref2=codes[_i],tag=_ref2[0],i1=_ref2[1],i2=_ref2[2],j1=_ref2[3],j2=_ref2[4];if(tag==="equal"&&i2-i1>nn){group.push([tag,i1,min(i2,i1+n),j1,min(j2,j1+n)]);groups.push(group);group=[];_ref3=[max(i1,i2-n),max(j1,j2-n)],i1=_ref3[0],j1=_ref3[1];}group.push([tag,i1,i2,j1,j2]);}if(group.length&&!(group.length===1&&group[0][0]==="equal")){groups.push(group);}return groups};SequenceMatcher.prototype.ratio=function(){var match,matches,_i,_len,_ref;matches=0;_ref=this.getMatchingBlocks();for(_i=0,_len=_ref.length;_i<_len;_i++){match=_ref[_i];matches+=match[2];}return _calculateRatio(matches,this.a.length+this.b.length)};SequenceMatcher.prototype.quickRatio=function(){var avail,elt,fullbcount,matches,numb,_i,_j,_len,_len1,_ref,_ref1;if(!this.fullbcount){this.fullbcount=fullbcount={};_ref=this.b;for(_i=0,_len=_ref.length;_i<_len;_i++){elt=_ref[_i];fullbcount[elt]=(fullbcount[elt]||0)+1;}}fullbcount=this.fullbcount;avail={};matches=0;_ref1=this.a;for(_j=0,_len1=_ref1.length;_j<_len1;_j++){elt=_ref1[_j];if(_has(avail,elt)){numb=avail[elt];}else {numb=fullbcount[elt]||0;}avail[elt]=numb-1;if(numb>0){matches++;}}return _calculateRatio(matches,this.a.length+this.b.length)};SequenceMatcher.prototype.realQuickRatio=function(){var la,lb,_ref;_ref=[this.a.length,this.b.length],la=_ref[0],lb=_ref[1];return _calculateRatio(min(la,lb),la+lb)};return SequenceMatcher}();module.exports=SequenceMatcher;},{}],3:[function(require,module,exports){require("string.prototype.codepointat");require("string.fromcodepoint");var collator;try{collator=typeof Intl!=="undefined"&&typeof Intl.Collator!=="undefined"?Intl.Collator("generic",{sensitivity:"base"}):null;}catch(err){if(typeof console!==undefined)console.warn("Collator could not be initialized and wouldn't be used");}module.exports=function leven(a,b,options,_toArray){var arr=[];var charCodeCache=[];var useCollator=options&&collator&&options.useCollator;var subcost=1;if(options&&options.subcost&&typeof options.subcost==="number")subcost=options.subcost;if(a===b){return 0}var achars=_toArray(a);var bchars=_toArray(b);var aLen=achars.length;var bLen=bchars.length;if(aLen===0){return bLen}if(bLen===0){return aLen}var bCharCode;var ret;var tmp;var tmp2;var i=0;var j=0;while(i<aLen){charCodeCache[i]=achars[i].codePointAt(0);arr[i]=++i;}if(!useCollator){while(j<bLen){bCharCode=bchars[j].codePointAt(0);tmp=j++;ret=j;for(i=0;i<aLen;i++){tmp2=bCharCode===charCodeCache[i]?tmp:tmp+subcost;tmp=arr[i];ret=arr[i]=tmp>ret?tmp2>ret?ret+1:tmp2:tmp2>tmp?tmp+1:tmp2;}}}else {while(j<bLen){bCharCode=bchars[j].codePointAt(0);tmp=j++;ret=j;for(i=0;i<aLen;i++){tmp2=0===collator.compare(String.fromCodePoint(bCharCode),String.fromCodePoint(charCodeCache[i]))?tmp:tmp+subcost;tmp=arr[i];ret=arr[i]=tmp>ret?tmp2>ret?ret+1:tmp2:tmp2>tmp?tmp+1:tmp2;}}}return ret};},{"string.fromcodepoint":17,"string.prototype.codepointat":18}],4:[function(require,module,exports){var collator;try{collator=typeof Intl!=="undefined"&&typeof Intl.Collator!=="undefined"?Intl.Collator("generic",{sensitivity:"base"}):null;}catch(err){if(typeof console!==undefined)console.warn("Collator could not be initialized and wouldn't be used");}module.exports=function leven(a,b,options){var arr=[];var charCodeCache=[];var useCollator=options&&collator&&options.useCollator;var subcost=1;if(options&&options.subcost&&typeof options.subcost==="number")subcost=options.subcost;if(a===b){return 0}var aLen=a.length;var bLen=b.length;if(aLen===0){return bLen}if(bLen===0){return aLen}var bCharCode;var ret;var tmp;var tmp2;var i=0;var j=0;while(i<aLen){charCodeCache[i]=a.charCodeAt(i);arr[i]=++i;}if(!useCollator){while(j<bLen){bCharCode=b.charCodeAt(j);tmp=j++;ret=j;for(i=0;i<aLen;i++){tmp2=bCharCode===charCodeCache[i]?tmp:tmp+subcost;tmp=arr[i];ret=arr[i]=tmp>ret?tmp2>ret?ret+1:tmp2:tmp2>tmp?tmp+1:tmp2;}}}else {while(j<bLen){bCharCode=b.charCodeAt(j);tmp=j++;ret=j;for(i=0;i<aLen;i++){tmp2=0===collator.compare(String.fromCharCode(bCharCode),String.fromCharCode(charCodeCache[i]))?tmp:tmp+subcost;tmp=arr[i];ret=arr[i]=tmp>ret?tmp2>ret?ret+1:tmp2:tmp2>tmp?tmp+1:tmp2;}}}return ret};},{}],5:[function(require,module,exports){(function(global){(function(){function t(t,e,r){switch(r.length){case 0:return t.call(e);case 1:return t.call(e,r[0]);case 2:return t.call(e,r[0],r[1]);case 3:return t.call(e,r[0],r[1],r[2])}return t.apply(e,r)}function e(t,e){for(var r=-1,n=null==t?0:t.length;++r<n&&false!==e(t[r],r,t););return t}function r(t,e){for(var r=-1,n=null==t?0:t.length,u=0,o=[];++r<n;){var i=t[r];e(i,r,t)&&(o[u++]=i);}return o}function n(t,e){var r;if(r=!(null==t||!t.length)){if(e===e)t:{r=-1;for(var n=t.length;++r<n;)if(t[r]===e)break t;r=-1;}else t:{r=a;for(var n=t.length,u=-1;++u<n;)if(r(t[u],u,t)){r=u;break t}r=-1;}r=-1<r;}return r}function u(t,e,r){for(var n=-1,u=null==t?0:t.length;++n<u;)if(r(e,t[n]))return true;return false}function o(t,e){for(var r=-1,n=null==t?0:t.length,u=Array(n);++r<n;)u[r]=e(t[r],r,t);return u}function i(t,e){for(var r=-1,n=e.length,u=t.length;++r<n;)t[u+r]=e[r];return t}function c(t,e){for(var r=-1,n=null==t?0:t.length;++r<n;)if(e(t[r],r,t))return true;return false}function a(t){return t!==t}function f(t){return function(e){return null==e?ae:e[t]}}function l(t){return function(e){return t(e)}}function s(t,e){return o(e,function(e){return t[e]})}function h(t,e){return t.has(e)}function b(t){var e=-1,r=Array(t.size);return t.forEach(function(t,n){r[++e]=[n,t];}),r}function p(t){var e=Object;return function(r){return t(e(r))}}function y(t,e){for(var r=-1,n=t.length,u=0,o=[];++r<n;){var i=t[r];i!==e&&"__lodash_placeholder__"!==i||(t[r]="__lodash_placeholder__",o[u++]=r);}return o}function _(t){var e=-1,r=Array(t.size);return t.forEach(function(t){r[++e]=t;}),r}function g(){}function v(t){this.__wrapped__=t,this.__actions__=[],this.__dir__=1,this.__filtered__=false,this.__iteratees__=[],this.__takeCount__=4294967295,this.__views__=[];}function d(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1]);}}function j(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1]);}}function w(t){var e=-1,r=null==t?0:t.length;for(this.clear();++e<r;){var n=t[e];this.set(n[0],n[1]);}}function A(t){var e=-1,r=null==t?0:t.length;for(this.__data__=new w;++e<r;)this.add(t[e]);}function m(t){this.size=(this.__data__=new j(t)).size;}function O(t,e){var r=Xr(t),n=!r&&Qr(t),u=!r&&!n&&Yr(t),o=!r&&!n&&!u&&en(t);if(r=r||n||u||o){for(var n=t.length,i=String,c=-1,a=Array(n);++c<n;)a[c]=i(c);n=a;}else n=[];var f,i=n.length;for(f in t)!e&&!He.call(t,f)||r&&("length"==f||u&&("offset"==f||"parent"==f)||o&&("buffer"==f||"byteLength"==f||"byteOffset"==f)||Ot(f,i))||n.push(f);return n}function S(t,e,r){var n=t[e];He.call(t,e)&&Rt(n,r)&&(r!==ae||e in t)||E(t,e,r);}function k(t,e){for(var r=t.length;r--;)if(Rt(t[r][0],e))return r;return -1}function x(t,e){return t&&nt(e,Yt(e),t)}function z(t,e){return t&&nt(e,Zt(e),t)}function E(t,e,r){"__proto__"==e&&fr?fr(t,e,{configurable:true,enumerable:true,value:r,writable:true}):t[e]=r;}function F(t,r,n,u,o,i){var c,a=1&r,f=2&r,l=4&r;if(n&&(c=o?n(t,u,o,i):n(t)),c!==ae)return c;if(!Tt(t))return t;if(u=Xr(t)){if(c=wt(t),!a)return rt(t,c)}else {var s=Nr(t),h="[object Function]"==s||"[object GeneratorFunction]"==s;if(Yr(t))return Y(t,a);if("[object Object]"==s||"[object Arguments]"==s||h&&!o){if(c=f||h?{}:typeof t.constructor!="function"||kt(t)?{}:Mr(rr(t)),!a)return f?ot(t,z(c,t)):ut(t,x(c,t))}else {if(!Ie[s])return o?t:{};c=At(t,s,a);}}if(i||(i=new m),o=i.get(t))return o;if(i.set(t,c),tn(t))return t.forEach(function(e){c.add(F(e,r,n,e,t,i));}),c;if(Zr(t))return t.forEach(function(e,u){c.set(u,F(e,r,n,u,t,i));}),c;var f=l?f?yt:pt:f?Zt:Yt,b=u?ae:f(t);return e(b||t,function(e,u){b&&(u=e,e=t[u]),S(c,u,F(e,r,n,u,t,i));}),c}function I(t,e,r,i){var c=-1,a=n,f=true,s=t.length,b=[],p=e.length;if(!s)return b;r&&(e=o(e,l(r))),i?(a=u,f=false):200<=e.length&&(a=h,f=false,e=new A(e));t:for(;++c<s;){var y=t[c],_=null==r?y:r(y),y=i||0!==y?y:0;if(f&&_===_){for(var g=p;g--;)if(e[g]===_)continue t;b.push(y);}else a(e,_,i)||b.push(y);}return b}function M(t,e,r,n,u){var o=-1,c=t.length;for(r||(r=mt),u||(u=[]);++o<c;){var a=t[o];0<e&&r(a)?1<e?M(a,e-1,r,n,u):i(u,a):n||(u[u.length]=a);}return u}function $(t,e){e=X(e,t);for(var r=0,n=e.length;null!=t&&r<n;)t=t[It(e[r++])];return r&&r==n?t:ae}function U(t,e,r){return e=e(t),Xr(t)?e:i(e,r(t))}function B(t){if(null==t)t=t===ae?"[object Undefined]":"[object Null]";else if(ar&&ar in Object(t)){var e=He.call(t,ar),r=t[ar];try{t[ar]=ae;var n=true;}catch(t){}var u=Qe.call(t);n&&(e?t[ar]=r:delete t[ar]),t=u;}else t=Qe.call(t);return t;

    }function D(t,e,r){for(var i=r?u:n,c=t[0].length,a=t.length,f=a,s=Array(a),b=1/0,p=[];f--;){var y=t[f];f&&e&&(y=o(y,l(e))),b=pr(y.length,b),s[f]=!r&&(e||120<=c&&120<=y.length)?new A(f&&y):ae;}var y=t[0],_=-1,g=s[0];t:for(;++_<c&&p.length<b;){var v=y[_],d=e?e(v):v,v=r||0!==v?v:0;if(g?!h(g,d):!i(p,d,r)){for(f=a;--f;){var j=s[f];if(j?!h(j,d):!i(t[f],d,r))continue t}g&&g.push(d),p.push(v);}}return p}function R(t){return Vt(t)&&"[object Arguments]"==B(t)}function L(t,e,r,n,u){if(t===e)e=true;else if(null==t||null==e||!Vt(t)&&!Vt(e))e=t!==t&&e!==e;else t:{var o=Xr(t),i=Xr(e),c=o?"[object Array]":Nr(t),a=i?"[object Array]":Nr(e),c="[object Arguments]"==c?"[object Object]":c,a="[object Arguments]"==a?"[object Object]":a,f="[object Object]"==c,i="[object Object]"==a;if((a=c==a)&&Yr(t)){if(!Yr(e)){e=false;break t}o=true,f=false;}if(a&&!f)u||(u=new m),e=o||en(t)?ht(t,e,r,n,L,u):bt(t,e,c,r,n,L,u);else {if(!(1&r)&&(o=f&&He.call(t,"__wrapped__"),c=i&&He.call(e,"__wrapped__"),o||c)){t=o?t.value():t,e=c?e.value():e,u||(u=new m),e=L(t,e,r,n,u);break t}if(a)e:if(u||(u=new m),o=1&r,c=pt(t),i=c.length,a=pt(e).length,i==a||o){for(f=i;f--;){var l=c[f];if(!(o?l in e:He.call(e,l))){e=false;break e}}if((a=u.get(t))&&u.get(e))e=a==e;else {a=true,u.set(t,e),u.set(e,t);for(var s=o;++f<i;){var l=c[f],h=t[l],b=e[l];if(n)var p=o?n(b,h,l,e,t,u):n(h,b,l,t,e,u);if(p===ae?h!==b&&!L(h,b,r,n,u):!p){a=false;break}s||(s="constructor"==l);}a&&!s&&(r=t.constructor,n=e.constructor,r!=n&&"constructor"in t&&"constructor"in e&&!(typeof r=="function"&&r instanceof r&&typeof n=="function"&&n instanceof n)&&(a=false)),u.delete(t),u.delete(e),e=a;}}else e=false;else e=false;}}return e}function P(t){return Vt(t)&&"[object Map]"==Nr(t)}function C(t,e){var r=e.length,n=r;if(null==t)return !n;for(t=Object(t);r--;){var u=e[r];if(u[2]?u[1]!==t[u[0]]:!(u[0]in t))return false}for(;++r<n;){var u=e[r],o=u[0],i=t[o],c=u[1];if(u[2]){if(i===ae&&!(o in t))return false}else if(u=new m,!L(c,i,3,void 0,u))return false}return true}function N(t){return Vt(t)&&"[object Set]"==Nr(t)}function T(t){return Vt(t)&&Nt(t.length)&&!!Fe[B(t)]}function V(t){return typeof t=="function"?t:null==t?re:typeof t=="object"?Xr(t)?q(t[0],t[1]):W(t):oe(t)}function W(t){var e=dt(t);return 1==e.length&&e[0][2]?xt(e[0][0],e[0][1]):function(r){return r===t||C(r,e)}}function q(t,e){return St(t)&&e===e&&!Tt(e)?xt(It(t),e):function(r){var n=Qt(r,t);return n===ae&&n===e?Xt(r,t):L(e,n,3)}}function G(t){return function(e){return $(e,t)}}function K(t){return Vr(zt(t,re),t+"")}function H(t){if(typeof t=="string")return t;if(Xr(t))return o(t,H)+"";if(qt(t))return Ir?Ir.call(t):"";var e=t+"";return "0"==e&&1/t==-fe?"-0":e}function J(t,e,r){var o=-1,i=n,c=t.length,a=true,f=[],l=f;if(r)a=false,i=u;else if(200<=c){if(i=e?null:Rr(t))return _(i);a=false,i=h,l=new A;}else l=e?[]:f;t:for(;++o<c;){var s=t[o],b=e?e(s):s,s=r||0!==s?s:0;if(a&&b===b){for(var p=l.length;p--;)if(l[p]===b)continue t;e&&l.push(b),f.push(s);}else i(l,b,r)||(l!==f&&l.push(b),f.push(s));}return f}function Q(t){return Pt(t)?t:[]}function X(t,e){return Xr(t)?t:St(t,e)?[t]:Wr(Jt(t))}function Y(t,e){if(e)return t.slice();var r=t.length,r=er?er(r):new t.constructor(r);return t.copy(r),r}function Z(t){var e=new t.constructor(t.byteLength);return new tr(e).set(new tr(t)),e}function tt(t,e,r,n){var u=-1,o=t.length,i=r.length,c=-1,a=e.length,f=br(o-i,0),l=Array(a+f);for(n=!n;++c<a;)l[c]=e[c];for(;++u<i;)(n||u<o)&&(l[r[u]]=t[u]);for(;f--;)l[c++]=t[u++];return l}function et(t,e,r,n){var u=-1,o=t.length,i=-1,c=r.length,a=-1,f=e.length,l=br(o-c,0),s=Array(l+f);for(n=!n;++u<l;)s[u]=t[u];for(l=u;++a<f;)s[l+a]=e[a];for(;++i<c;)(n||u<o)&&(s[l+r[i]]=t[u++]);return s}function rt(t,e){var r=-1,n=t.length;for(e||(e=Array(n));++r<n;)e[r]=t[r];return e}function nt(t,e,r){var n=!r;r||(r={});for(var u=-1,o=e.length;++u<o;){var i=e[u],c=ae;c===ae&&(c=t[i]),n?E(r,i,c):S(r,i,c);}return r}function ut(t,e){return nt(t,Pr(t),e)}function ot(t,e){return nt(t,Cr(t),e)}function it(t,e,r){function n(){return (this&&this!==De&&this instanceof n?o:t).apply(u?r:this,arguments)}var u=1&e,o=ct(t);return n}function ct(t){return function(){var e=arguments;switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3]);case 5:return new t(e[0],e[1],e[2],e[3],e[4]);case 6:return new t(e[0],e[1],e[2],e[3],e[4],e[5]);case 7:return new t(e[0],e[1],e[2],e[3],e[4],e[5],e[6])}var r=Mr(t.prototype),e=t.apply(r,e);return Tt(e)?e:r}}function at(e,r,n){function u(){for(var i=arguments.length,c=Array(i),a=i,f=_t(u);a--;)c[a]=arguments[a];return a=3>i&&c[0]!==f&&c[i-1]!==f?[]:y(c,f),i-=a.length,i<n?st(e,r,ft,u.placeholder,ae,c,a,ae,ae,n-i):t(this&&this!==De&&this instanceof u?o:e,this,c)}var o=ct(e);return u}function ft(t,e,r,n,u,o,i,c,a,f){function l(){for(var v=arguments.length,d=Array(v),j=v;j--;)d[j]=arguments[j];if(p){var w,A=_t(l),j=d.length;for(w=0;j--;)d[j]===A&&++w;}if(n&&(d=tt(d,n,u,p)),o&&(d=et(d,o,i,p)),v-=w,p&&v<f)return A=y(d,A),st(t,e,ft,l.placeholder,r,d,A,c,a,f-v);if(A=h?r:this,j=b?A[t]:t,v=d.length,c){w=d.length;for(var m=pr(c.length,w),O=rt(d);m--;){var S=c[m];d[m]=Ot(S,w)?O[S]:ae;}}else _&&1<v&&d.reverse();return s&&a<v&&(d.length=a),this&&this!==De&&this instanceof l&&(j=g||ct(j)),j.apply(A,d)}var s=128&e,h=1&e,b=2&e,p=24&e,_=512&e,g=b?ae:ct(t);return l}function lt(e,r,n,u){function o(){for(var r=-1,a=arguments.length,f=-1,l=u.length,s=Array(l+a),h=this&&this!==De&&this instanceof o?c:e;++f<l;)s[f]=u[f];for(;a--;)s[f++]=arguments[++r];return t(h,i?n:this,s)}var i=1&r,c=ct(e);return o}function st(t,e,r,n,u,o,i,c,a,f){var l=8&e,s=l?i:ae;i=l?ae:i;var h=l?o:ae;o=l?ae:o,e=(e|(l?32:64))&~(l?64:32),4&e||(e&=-4),u=[t,e,u,h,s,o,i,c,a,f],r=r.apply(ae,u);t:for(c=t.name+"",a=mr[c],f=He.call(mr,c)?a.length:0;f--;)if(l=a[f],s=l.func,null==s||s==t){c=l.name;break t}return a=g[c],typeof a=="function"&&c in v.prototype?t===a?c=true:(c=Lr(a),c=!!c&&t===c[0]):c=false,c&&Tr(r,u),r.placeholder=n,Et(r,t,e)}function ht(t,e,r,n,u,o){var i=1&r,a=t.length,f=e.length;if(a!=f&&!(i&&f>a))return false;if((f=o.get(t))&&o.get(e))return f==e;var f=-1,l=true,s=2&r?new A:ae;for(o.set(t,e),o.set(e,t);++f<a;){var b=t[f],p=e[f];if(n)var y=i?n(p,b,f,e,t,o):n(b,p,f,t,e,o);if(y!==ae){if(y)continue;l=false;break}if(s){if(!c(e,function(t,e){if(!h(s,e)&&(b===t||u(b,t,r,n,o)))return s.push(e)})){l=false;break}}else if(b!==p&&!u(b,p,r,n,o)){l=false;break}}return o.delete(t),o.delete(e),l}function bt(t,e,r,n,u,o,i){switch(r){case"[object DataView]":if(t.byteLength!=e.byteLength||t.byteOffset!=e.byteOffset)break;t=t.buffer,e=e.buffer;case"[object ArrayBuffer]":if(t.byteLength!=e.byteLength||!o(new tr(t),new tr(e)))break;return true;case"[object Boolean]":case"[object Date]":case"[object Number]":return Rt(+t,+e);case"[object Error]":return t.name==e.name&&t.message==e.message;case"[object RegExp]":case"[object String]":return t==e+"";case"[object Map]":var c=b;case"[object Set]":if(c||(c=_),t.size!=e.size&&!(1&n))break;return (r=i.get(t))?r==e:(n|=2,i.set(t,e),e=ht(c(t),c(e),n,u,o,i),i.delete(t),e);case"[object Symbol]":if(Fr)return Fr.call(t)==Fr.call(e)}return false}function pt(t){return U(t,Yt,Pr)}function yt(t){return U(t,Zt,Cr)}function _t(t){return (He.call(g,"placeholder")?g:t).placeholder}function gt(){var t=g.iteratee||ne,t=t===ne?V:t;return arguments.length?t(arguments[0],arguments[1]):t}function vt(t,e){var r=t.__data__,n=typeof e;return ("string"==n||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==e:null===e)?r[typeof e=="string"?"string":"hash"]:r.map}function dt(t){for(var e=Yt(t),r=e.length;r--;){var n=e[r],u=t[n];e[r]=[n,u,u===u&&!Tt(u)];}return e}function jt(t,e){var r=null==t?ae:t[e];return (!Tt(r)||Je&&Je in r?0:(Ct(r)?Xe:me).test(Mt(r)))?r:ae}function wt(t){var e=t.length,r=new t.constructor(e);return e&&"string"==typeof t[0]&&He.call(t,"index")&&(r.index=t.index,r.input=t.input),r}function At(t,e,r){var n=t.constructor;switch(e){case"[object ArrayBuffer]":return Z(t);case"[object Boolean]":case"[object Date]":return new n(+t);case"[object DataView]":return e=r?Z(t.buffer):t.buffer,new t.constructor(e,t.byteOffset,t.byteLength);case"[object Float32Array]":case"[object Float64Array]":case"[object Int8Array]":case"[object Int16Array]":case"[object Int32Array]":case"[object Uint8Array]":case"[object Uint8ClampedArray]":case"[object Uint16Array]":case"[object Uint32Array]":return e=r?Z(t.buffer):t.buffer,new t.constructor(e,t.byteOffset,t.length);case"[object Map]":return new n;case"[object Number]":case"[object String]":return new n(t);case"[object RegExp]":return e=new t.constructor(t.source,je.exec(t)),e.lastIndex=t.lastIndex,e;case"[object Set]":return new n;case"[object Symbol]":return Fr?Object(Fr.call(t)):{}}}function mt(t){return Xr(t)||Qr(t)||!!(ir&&t&&t[ir])}function Ot(t,e){var r=typeof t;return e=null==e?9007199254740991:e,!!e&&("number"==r||"symbol"!=r&&Se.test(t))&&-1<t&&0==t%1&&t<e}function St(t,e){if(Xr(t))return false;var r=typeof t;return !("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=t&&!qt(t))||(be.test(t)||!he.test(t)||null!=e&&t in Object(e))}function kt(t){var e=t&&t.constructor;return t===(typeof e=="function"&&e.prototype||qe)}function xt(t,e){return function(r){return null!=r&&(r[t]===e&&(e!==ae||t in Object(r)))}}function zt(e,r){var n=void 0,n=br(n===ae?e.length-1:n,0);return function(){for(var u=arguments,o=-1,i=br(u.length-n,0),c=Array(i);++o<i;)c[o]=u[n+o];for(o=-1,i=Array(n+1);++o<n;)i[o]=u[o];return i[n]=r(c),t(e,this,i)}}function Et(t,e,r){var n=e+"";e=Vr;var u,o=$t;return u=(u=n.match(ge))?u[1].split(ve):[],r=o(u,r),(o=r.length)&&(u=o-1,r[u]=(1<o?"& ":"")+r[u],r=r.join(2<o?", ":" "),n=n.replace(_e,"{\n/* [wrapped with "+r+"] */\n")),e(t,n)}function Ft(t){var e=0,r=0;return function(){var n=yr(),u=16-(n-r);if(r=n,0<u){if(800<=++e)return arguments[0]}else e=0;return t.apply(ae,arguments)}}function It(t){if(typeof t=="string"||qt(t))return t;var e=t+"";return "0"==e&&1/t==-fe?"-0":e}function Mt(t){if(null!=t){try{return Ke.call(t)}catch(t){}return t+""}return ""}function $t(t,r){return e(se,function(e){var u="_."+e[0];r&e[1]&&!n(t,u)&&t.push(u);}),t.sort()}function Ut(t){var e=null==t?0:t.length;return e?t[e-1]:ae}function Bt(t,r){return (Xr(t)?e:$r)(t,gt(r,3))}function Dt(t,e){function r(){var n=arguments,u=e?e.apply(this,n):n[0],o=r.cache;return o.has(u)?o.get(u):(n=t.apply(this,n),r.cache=o.set(u,n)||o,n)}if(typeof t!="function"||null!=e&&typeof e!="function")throw new TypeError("Expected a function");return r.cache=new(Dt.Cache||w),r}function Rt(t,e){return t===e||t!==t&&e!==e}function Lt(t){return null!=t&&Nt(t.length)&&!Ct(t)}function Pt(t){return Vt(t)&&Lt(t)}function Ct(t){return !!Tt(t)&&(t=B(t),"[object Function]"==t||"[object GeneratorFunction]"==t||"[object AsyncFunction]"==t||"[object Proxy]"==t)}function Nt(t){return typeof t=="number"&&-1<t&&0==t%1&&9007199254740991>=t}function Tt(t){var e=typeof t;return null!=t&&("object"==e||"function"==e)}function Vt(t){return null!=t&&typeof t=="object"}function Wt(t){return typeof t=="string"||!Xr(t)&&Vt(t)&&"[object String]"==B(t)}function qt(t){return typeof t=="symbol"||Vt(t)&&"[object Symbol]"==B(t)}function Gt(t){return t?(t=Ht(t),t===fe||t===-fe?1.7976931348623157e308*(0>t?-1:1):t===t?t:0):0===t?t:0}function Kt(t){t=Gt(t);var e=t%1;return t===t?e?t-e:t:0}function Ht(t){if(typeof t=="number")return t;if(qt(t))return le;if(Tt(t)&&(t=typeof t.valueOf=="function"?t.valueOf():t,t=Tt(t)?t+"":t),typeof t!="string")return 0===t?t:+t;t=t.replace(ye,"");var e=Ae.test(t);return e||Oe.test(t)?$e(t.slice(2),e?2:8):we.test(t)?le:+t}function Jt(t){return null==t?"":H(t)}function Qt(t,e,r){return t=null==t?ae:$(t,e),t===ae?r:t}function Xt(t,e){var r;if(r=null!=t){r=t;var n;n=X(e,r);for(var u=-1,o=n.length,i=false;++u<o;){var c=It(n[u]);if(!(i=null!=r&&null!=r&&c in Object(r)))break;r=r[c];}i||++u!=o?r=i:(o=null==r?0:r.length,r=!!o&&Nt(o)&&Ot(c,o)&&(Xr(r)||Qr(r)));}return r}function Yt(t){if(Lt(t))t=O(t);else if(kt(t)){var e,r=[];for(e in Object(t))He.call(t,e)&&"constructor"!=e&&r.push(e);t=r;}else t=hr(t);return t}function Zt(t){if(Lt(t))t=O(t,true);else if(Tt(t)){var e,r=kt(t),n=[];for(e in t)("constructor"!=e||!r&&He.call(t,e))&&n.push(e);t=n;}else {if(e=[],null!=t)for(r in Object(t))e.push(r);t=e;}return t}function te(t){return null==t?[]:s(t,Yt(t))}function ee(t){return function(){return t}}function re(t){return t}function ne(t){return V(typeof t=="function"?t:F(t,1))}function ue(){}function oe(t){return St(t)?f(It(t)):G(t)}function ie(){return []}function ce(){return false}var ae,fe=1/0,le=NaN,se=[["ary",128],["bind",1],["bindKey",2],["curry",8],["curryRight",16],["flip",512],["partial",32],["partialRight",64],["rearg",256]],he=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,be=/^\w*$/,pe=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,ye=/^\s+|\s+$/g,_e=/\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,ge=/\{\n\/\* \[wrapped with (.+)\] \*/,ve=/,? & /,de=/\\(\\)?/g,je=/\w*$/,we=/^[-+]0x[0-9a-f]+$/i,Ae=/^0b[01]+$/i,me=/^\[object .+?Constructor\]$/,Oe=/^0o[0-7]+$/i,Se=/^(?:0|[1-9]\d*)$/,ke="[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?(?:\\u200d(?:[^\\ud800-\\udfff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff])[\\ufe0e\\ufe0f]?(?:[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|\\ud83c[\\udffb-\\udfff])?)*",xe="(?:[^\\ud800-\\udfff][\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]?|[\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff]|(?:\\ud83c[\\udde6-\\uddff]){2}|[\\ud800-\\udbff][\\udc00-\\udfff]|[\\ud800-\\udfff])",ze=RegExp("\\ud83c[\\udffb-\\udfff](?=\\ud83c[\\udffb-\\udfff])|"+xe+ke,"g"),Ee=RegExp("[\\u200d\\ud800-\\udfff\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff\\ufe0e\\ufe0f]"),Fe={};Fe["[object Float32Array]"]=Fe["[object Float64Array]"]=Fe["[object Int8Array]"]=Fe["[object Int16Array]"]=Fe["[object Int32Array]"]=Fe["[object Uint8Array]"]=Fe["[object Uint8ClampedArray]"]=Fe["[object Uint16Array]"]=Fe["[object Uint32Array]"]=true,Fe["[object Arguments]"]=Fe["[object Array]"]=Fe["[object ArrayBuffer]"]=Fe["[object Boolean]"]=Fe["[object DataView]"]=Fe["[object Date]"]=Fe["[object Error]"]=Fe["[object Function]"]=Fe["[object Map]"]=Fe["[object Number]"]=Fe["[object Object]"]=Fe["[object RegExp]"]=Fe["[object Set]"]=Fe["[object String]"]=Fe["[object WeakMap]"]=false;var Ie={};Ie["[object Arguments]"]=Ie["[object Array]"]=Ie["[object ArrayBuffer]"]=Ie["[object DataView]"]=Ie["[object Boolean]"]=Ie["[object Date]"]=Ie["[object Float32Array]"]=Ie["[object Float64Array]"]=Ie["[object Int8Array]"]=Ie["[object Int16Array]"]=Ie["[object Int32Array]"]=Ie["[object Map]"]=Ie["[object Number]"]=Ie["[object Object]"]=Ie["[object RegExp]"]=Ie["[object Set]"]=Ie["[object String]"]=Ie["[object Symbol]"]=Ie["[object Uint8Array]"]=Ie["[object Uint8ClampedArray]"]=Ie["[object Uint16Array]"]=Ie["[object Uint32Array]"]=true,Ie["[object Error]"]=Ie["[object Function]"]=Ie["[object WeakMap]"]=false;var Me,$e=parseInt,Ue=typeof global=="object"&&global&&global.Object===Object&&global,Be=typeof self=="object"&&self&&self.Object===Object&&self,De=Ue||Be||Function("return this")(),Re=typeof exports=="object"&&exports&&!exports.nodeType&&exports,Le=Re&&typeof module=="object"&&module&&!module.nodeType&&module,Pe=Le&&Le.exports===Re,Ce=Pe&&Ue.process;t:{try{Me=Ce&&Ce.binding&&Ce.binding("util");break t}catch(t){}Me=void 0;}var Ne=Me&&Me.isMap,Te=Me&&Me.isSet,Ve=Me&&Me.isTypedArray,We=Array.prototype,qe=Object.prototype,Ge=De["__core-js_shared__"],Ke=Function.prototype.toString,He=qe.hasOwnProperty,Je=function(){var t=/[^.]+$/.exec(Ge&&Ge.keys&&Ge.keys.IE_PROTO||"");return t?"Symbol(src)_1."+t:""}(),Qe=qe.toString,Xe=RegExp("^"+Ke.call(He).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$"),Ye=Pe?De.Buffer:ae,Ze=De.Symbol,tr=De.Uint8Array,er=Ye?Ye.a:ae,rr=p(Object.getPrototypeOf),nr=Object.create,ur=qe.propertyIsEnumerable,or=We.splice,ir=Ze?Ze.isConcatSpreadable:ae,cr=Ze?Ze.iterator:ae,ar=Ze?Ze.toStringTag:ae,fr=function(){try{var t=jt(Object,"defineProperty");return t({},"",{}),t}catch(t){}}(),lr=Object.getOwnPropertySymbols,sr=Ye?Ye.isBuffer:ae,hr=p(Object.keys),br=Math.max,pr=Math.min,yr=Date.now,_r=jt(De,"DataView"),gr=jt(De,"Map"),vr=jt(De,"Promise"),dr=jt(De,"Set"),jr=jt(De,"WeakMap"),wr=jt(Object,"create"),Ar=jr&&new jr,mr={},Or=Mt(_r),Sr=Mt(gr),kr=Mt(vr),xr=Mt(dr),zr=Mt(jr),Er=Ze?Ze.prototype:ae,Fr=Er?Er.valueOf:ae,Ir=Er?Er.toString:ae,Mr=function(){function t(){}return function(e){return Tt(e)?nr?nr(e):(t.prototype=e,e=new t,t.prototype=ae,e):{}}}();v.prototype=Mr(function(){}.prototype),v.prototype.constructor=v,d.prototype.clear=function(){this.__data__=wr?wr(null):{},this.size=0;},d.prototype.delete=function(t){return t=this.has(t)&&delete this.__data__[t],this.size-=t?1:0,t},d.prototype.get=function(t){var e=this.__data__;return wr?(t=e[t],"__lodash_hash_undefined__"===t?ae:t):He.call(e,t)?e[t]:ae},d.prototype.has=function(t){var e=this.__data__;return wr?e[t]!==ae:He.call(e,t)},d.prototype.set=function(t,e){var r=this.__data__;return this.size+=this.has(t)?0:1,r[t]=wr&&e===ae?"__lodash_hash_undefined__":e,this},j.prototype.clear=function(){this.__data__=[],this.size=0;},j.prototype.delete=function(t){var e=this.__data__;return t=k(e,t),!(0>t)&&(t==e.length-1?e.pop():or.call(e,t,1),--this.size,true)},j.prototype.get=function(t){var e=this.__data__;return t=k(e,t),0>t?ae:e[t][1]},j.prototype.has=function(t){return -1<k(this.__data__,t)},j.prototype.set=function(t,e){var r=this.__data__,n=k(r,t);return 0>n?(++this.size,r.push([t,e])):r[n][1]=e,this},w.prototype.clear=function(){this.size=0,this.__data__={hash:new d,map:new(gr||j),string:new d};},w.prototype.delete=function(t){return t=vt(this,t).delete(t),this.size-=t?1:0,t},w.prototype.get=function(t){return vt(this,t).get(t)},w.prototype.has=function(t){return vt(this,t).has(t)},w.prototype.set=function(t,e){var r=vt(this,t),n=r.size;return r.set(t,e),this.size+=r.size==n?0:1,this},A.prototype.add=A.prototype.push=function(t){return this.__data__.set(t,"__lodash_hash_undefined__"),this},A.prototype.has=function(t){return this.__data__.has(t)},m.prototype.clear=function(){this.__data__=new j,this.size=0;},m.prototype.delete=function(t){var e=this.__data__;return t=e.delete(t),this.size=e.size,t},m.prototype.get=function(t){return this.__data__.get(t)},m.prototype.has=function(t){return this.__data__.has(t)},m.prototype.set=function(t,e){var r=this.__data__;if(r instanceof j){var n=r.__data__;if(!gr||199>n.length)return n.push([t,e]),this.size=++r.size,this;r=this.__data__=new w(n);}return r.set(t,e),this.size=r.size,this};var $r=function(t,e){return function(r,n){if(null==r)return r;if(!Lt(r))return t(r,n);for(var u=r.length,o=e?u:-1,i=Object(r);(e?o--:++o<u)&&false!==n(i[o],o,i););return r}}(function(t,e){return t&&Ur(t,e,Yt)}),Ur=function(t){return function(e,r,n){var u=-1,o=Object(e);n=n(e);for(var i=n.length;i--;){var c=n[t?i:++u];if(false===r(o[c],c,o))break}return e}}(),Br=Ar?function(t,e){return Ar.set(t,e),t}:re,Dr=fr?function(t,e){return fr(t,"toString",{configurable:true,enumerable:false,value:ee(e),writable:true})}:re,Rr=dr&&1/_(new dr([,-0]))[1]==fe?function(t){return new dr(t)}:ue,Lr=Ar?function(t){return Ar.get(t)}:ue,Pr=lr?function(t){return null==t?[]:(t=Object(t),r(lr(t),function(e){return ur.call(t,e)}))}:ie,Cr=lr?function(t){for(var e=[];t;)i(e,Pr(t)),t=rr(t);return e}:ie,Nr=B;(_r&&"[object DataView]"!=Nr(new _r(new ArrayBuffer(1)))||gr&&"[object Map]"!=Nr(new gr)||vr&&"[object Promise]"!=Nr(vr.resolve())||dr&&"[object Set]"!=Nr(new dr)||jr&&"[object WeakMap]"!=Nr(new jr))&&(Nr=function(t){var e=B(t);if(t=(t="[object Object]"==e?t.constructor:ae)?Mt(t):"")switch(t){case Or:return "[object DataView]";case Sr:return "[object Map]";case kr:return "[object Promise]";case xr:return "[object Set]";case zr:return "[object WeakMap]"}return e});var Tr=Ft(Br),Vr=Ft(Dr),Wr=function(t){t=Dt(t,function(t){return 500===e.size&&e.clear(),t});var e=t.cache;return t}(function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(pe,function(t,r,n,u){e.push(n?u.replace(de,"$1"):r||t);}),e}),qr=K(function(t,e){return Pt(t)?I(t,M(e,1,Pt,true)):[]}),Gr=K(function(t,e){var r=Ut(e);return Pt(r)&&(r=ae),Pt(t)?I(t,M(e,1,Pt,true),ae,r):[]}),Kr=K(function(t){var e=o(t,Q);return e.length&&e[0]===t[0]?D(e):[]}),Hr=K(function(t){var e=Ut(t),r=o(t,Q);return (e=typeof e=="function"?e:ae)&&r.pop(),r.length&&r[0]===t[0]?D(r,ae,e):[]});Dt.Cache=w;var Jr=K(function(t,e){var r,n,u=y(e,_t(Jr)),o=t,i=ae,c=e,a=u,f=64,u=2&f;if(!u&&typeof o!="function")throw new TypeError("Expected a function");var l=c?c.length:0;if(l||(f&=-97,c=a=ae),r=r===ae?r:br(Kt(r),0),n=n===ae?n:Kt(n),l-=a?a.length:0,64&f)var s=c,h=a,c=a=ae;var b=u?ae:Lr(o);return r=[o,f,i,c,a,s,h,void 0,r,n],b&&(c=r[1],o=b[1],i=c|o,n=128==o&&8==c||128==o&&256==c&&r[7].length<=b[8]||384==o&&b[7].length<=b[8]&&8==c,131>i||n)&&(1&o&&(r[2]=b[2],i|=1&c?0:4),(c=b[3])&&(n=r[3],r[3]=n?tt(n,c,b[4]):c,r[4]=n?y(r[3],"__lodash_placeholder__"):b[4]),(c=b[5])&&(n=r[5],r[5]=n?et(n,c,b[6]):c,r[6]=n?y(r[5],"__lodash_placeholder__"):b[6]),(c=b[7])&&(r[7]=c),128&o&&(r[8]=null==r[8]?b[8]:pr(r[8],b[8])),null==r[9]&&(r[9]=b[9]),r[0]=b[0],r[1]=i),o=r[0],f=r[1],i=r[2],c=r[3],a=r[4],n=r[9]=r[9]===ae?u?0:o.length:br(r[9]-l,0),!n&&24&f&&(f&=-25),Et((b?Br:Tr)(f&&1!=f?8==f||16==f?at(o,f,n):32!=f&&33!=f||a.length?ft.apply(ae,r):lt(o,f,i,c):it(o,f,i),r),o,f)}),Qr=R(function(){return arguments}())?R:function(t){return Vt(t)&&He.call(t,"callee")&&!ur.call(t,"callee")},Xr=Array.isArray,Yr=sr||ce,Zr=Ne?l(Ne):P,tn=Te?l(Te):N,en=Ve?l(Ve):T;g.constant=ee,g.difference=qr,g.differenceWith=Gr,g.intersection=Kr,g.intersectionWith=Hr,g.iteratee=ne,g.keys=Yt,g.keysIn=Zt,g.memoize=Dt,g.partialRight=Jr,g.property=oe,g.toArray=function(t){if(!t)return [];if(Lt(t))return Wt(t)?Ee.test(t)?t.match(ze)||[]:t.split(""):rt(t);if(cr&&t[cr]){t=t[cr]();for(var e,r=[];!(e=t.next()).done;)r.push(e.value);return r}return e=Nr(t),("[object Map]"==e?b:"[object Set]"==e?_:te)(t)},g.uniq=function(t){return t&&t.length?J(t):[]},g.uniqWith=function(t,e){return e=typeof e=="function"?e:ae,t&&t.length?J(t,ae,e):[]},g.values=te,g.eq=Rt,g.forEach=Bt,g.get=Qt,g.hasIn=Xt,g.identity=re,g.isArguments=Qr,g.isArray=Xr,g.isArrayLike=Lt,g.isArrayLikeObject=Pt,g.isBuffer=Yr,g.isFunction=Ct,g.isLength=Nt,g.isMap=Zr,g.isObject=Tt,g.isObjectLike=Vt,g.isSet=tn,g.isString=Wt,g.isSymbol=qt,g.isTypedArray=en,g.last=Ut,g.stubArray=ie,g.stubFalse=ce,g.noop=ue,g.toFinite=Gt,g.toInteger=Kt,g.toNumber=Ht,g.toString=Jt,g.each=Bt,g.VERSION="4.17.5",Jr.placeholder=g,Le?((Le.exports=g)._=g,Re._=g):De._=g;}).call(this);}).call(this,typeof commonjsGlobal!=="undefined"?commonjsGlobal:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{}],6:[function(require,module,exports){module.exports=function(_clone_and_set_option_defaults,_isArray,QRatio,extract){module={};module.dedupe=function dedupe(contains_dupes,options_p){var options=_clone_and_set_option_defaults(options_p);if(!(_isArray(contains_dupes)||typeof contains_dupes==="object")){throw new Error("contains_dupes must be an array or object");}if(Object.keys(contains_dupes).length===0){if(typeof console!==undefined)console.warn("contains_dupes is empty");return []}if(options.limit){if(typeof console!==undefined)console.warn("options.limit will be ignored in dedupe");options.limit=0;}if(!options.cutoff||typeof options.cutoff!=="number"){if(typeof console!==undefined)console.warn("Using default cutoff of 70");options.cutoff=70;}if(!options.scorer){options.scorer=QRatio;if(typeof console!==undefined)console.log("Using default scorer 'ratio' for dedupe");}var processor;if(options.processor&&typeof options.processor==="function"){processor=options.processor;}else processor=function(x){return x};var uniqueItems={};for(var i in contains_dupes){var item=processor(contains_dupes[i]);if(typeof item!=="string"&&item instanceof String===false){throw new Error("Each processed item in dedupe must be a string.")}var matches=extract(item,contains_dupes,options);if(options.returnObjects){if(matches.length===1){if(options.keepmap)uniqueItems[processor(matches[0].choice)]={item:matches[0].choice,key:matches[0].key,matches:matches};else uniqueItems[processor(matches[0].choice)]={item:matches[0].choice,key:matches[0].key};}else {matches=matches.sort(function(a,b){var pa=processor(a.choice);var pb=processor(b.choice);var aLen=pa.length;var bLen=pb.length;if(aLen===bLen){if(pa<pb)return -1;else return 1}else return bLen-aLen});if(options.keepmap)uniqueItems[processor(matches[0].choice)]={item:matches[0].choice,key:matches[0].key,matches:matches};else uniqueItems[processor(matches[0].choice)]={item:matches[0].choice,key:matches[0].key};}}else {if(matches.length===1){if(options.keepmap)uniqueItems[processor(matches[0][0])]=[matches[0][0],matches[0][2],matches];else uniqueItems[processor(matches[0][0])]=[matches[0][0],matches[0][2]];}else {matches=matches.sort(function(a,b){var pa=processor(a[0]);var pb=processor(b[0]);var aLen=pa.length;var bLen=pb.length;if(aLen===bLen){if(pa<pb)return -1;else return 1}else return bLen-aLen});if(options.keepmap)uniqueItems[processor(matches[0][0])]=[matches[0][0],matches[0][2],matches];else uniqueItems[processor(matches[0][0])]=[matches[0][0],matches[0][2]];}}}var uniqueVals=[];for(var u in uniqueItems){uniqueVals.push(uniqueItems[u]);}return uniqueVals};return module};},{}],7:[function(require,module,exports){module.exports=function(_uniq,_uniqWith,_partialRight){var module={};var xre=require("./xregexp/index.js");var wildLeven=require("./wildcardLeven.js");var leven=require("./leven.js");function escapeRegExp(string){return string.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function validate(str){if((typeof str==="string"||str instanceof String)&&str.length>0)return true;else return false}module.validate=validate;module.process_and_sort=function process_and_sort(str){if(!validate(str))return "";return str.match(/\S+/g).sort().join(" ").trim()};module.tokenize=function unique_tokens(str,options){if(options&&options.wildcards&&_uniqWith&&_partialRight){var partWild=_partialRight(wildLeven,options,leven);var wildCompare=function(a,b){return partWild(a,b)===0};return _uniqWith(str.match(/\S+/g),wildCompare)}else return _uniq(str.match(/\S+/g))};var alphaNumUnicode=xre("[^\\pN|\\pL]","g");module.full_process=function full_process(str,options){if(!(str instanceof String)&&typeof str!=="string")return "";var processedtext;if(options&&typeof options==="object"&&options.wildcards&&typeof options.wildcards==="string"&&options.wildcards.length>0){var wildcards=options.wildcards.toLowerCase();str=str.toLowerCase();if(options.force_ascii){var pattern="[^\x00 -|"+escapeRegExp(wildcards)+"]";str=str.replace(new RegExp(pattern,"g"),"");var wildpattern="["+escapeRegExp(wildcards)+"]";var wildchar=wildcards[0];str=str.replace(new RegExp(wildpattern,"g"),wildchar);var alphanumPat="[^A-Za-z0-9"+escapeRegExp(wildcards)+"]";str=str.replace(new RegExp(alphanumPat,"g")," ");str=str.replace(/_/g," ");processedtext=str.trim();}else {var upattern="[^\\pN|\\pL|"+escapeRegExp(wildcards)+"]";var alphaNumUnicodeWild=xre(upattern,"g");str=xre.replace(str,alphaNumUnicodeWild," ","all");var wildpattern="["+escapeRegExp(wildcards)+"]";var wildchar=wildcards[0];str=str.replace(new RegExp(wildpattern,"g"),wildchar);processedtext=str.trim();}}else {if(options&&(options.force_ascii||options===true)){str=str.replace(/[^\x00-\x7F]/g,"");processedtext=str.replace(/\W|_/g," ").toLowerCase().trim();}processedtext=xre.replace(str,alphaNumUnicode," ","all").toLowerCase().trim();}if(options&&options.collapseWhitespace){processedtext=processedtext.replace(/\s+/g," ");}return processedtext};module.clone_and_set_option_defaults=function(options){if(options&&options.isAClone)return options;var optclone={isAClone:true};if(options){var i,keys=Object.keys(options);for(i=0;i<keys.length;i++){optclone[keys[i]]=options[keys[i]];}}if(!(typeof optclone.full_process!=="undefined"&&optclone.full_process===false))optclone.full_process=true;if(!(typeof optclone.force_ascii!=="undefined"&&optclone.force_ascii===true))optclone.force_ascii=false;if(!(typeof optclone.normalize!=="undefined"&&optclone.normalize===false))optclone.normalize=true;if(typeof optclone.astral!=="undefined"&&optclone.astral===true)optclone.full_process=false;if(!(typeof optclone.collapseWhitespace!=="undefined"&&optclone.collapseWhitespace===false))optclone.collapseWhitespace=true;return optclone};module.isCustomFunc=function(func){if(typeof func==="function"&&(func.name==="token_set_ratio"||func.name==="partial_token_set_ratio"||func.name==="token_sort_ratio"||func.name==="partial_token_sort_ratio"||func.name==="QRatio"||func.name==="WRatio"||func.name==="distance"||func.name==="partial_ratio")){return false}else {return true}};return module};},{"./leven.js":4,"./wildcardLeven.js":8,"./xregexp/index.js":9}],8:[function(require,module,exports){var collator;try{collator=typeof Intl!=="undefined"&&typeof Intl.Collator!=="undefined"?Intl.Collator("generic",{sensitivity:"base"}):null;}catch(err){if(typeof console!==undefined)console.warn("Collator could not be initialized and wouldn't be used");}module.exports=function leven(a,b,options,regLeven){var arr=[];var charCodeCache=[];var useCollator=options&&collator&&options.useCollator;var subcost=1;if(options&&options.subcost&&typeof options.subcost==="number")subcost=options.subcost;if(a===b){return 0}var aLen=a.length;var bLen=b.length;if(aLen===0){return bLen}if(bLen===0){return aLen}function escapeRegExp(string){return string.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}if(options&&options.wildcards&&typeof options.wildcards==="string"&&options.wildcards.length>0){var wildchar;var wildcode;if(options.full_process===false&&options.processed!==true){wildchar=options.wildcards[0];wildcode=wildchar.charCodeAt(0);var pattern="["+escapeRegExp(options.wildcards)+"]";a=a.replace(new RegExp(pattern,"g"),wildchar);b=b.replace(new RegExp(pattern,"g"),wildchar);if(a===b)return 0}else {wildchar=options.wildcards[0].toLowerCase();wildcode=wildchar.charCodeAt(0);}var bCharCode;var ret;var tmp;var tmp2;var i=0;var j=0;while(i<aLen){charCodeCache[i]=a.charCodeAt(i);arr[i]=++i;}if(!useCollator){while(j<bLen){bCharCode=b.charCodeAt(j);tmp=j++;ret=j;for(i=0;i<aLen;i++){tmp2=bCharCode===charCodeCache[i]||bCharCode===wildcode||charCodeCache[i]===wildcode?tmp:tmp+subcost;tmp=arr[i];ret=arr[i]=tmp>ret?tmp2>ret?ret+1:tmp2:tmp2>tmp?tmp+1:tmp2;}}}else {while(j<bLen){bCharCode=b.charCodeAt(j);tmp=j++;ret=j;for(i=0;i<aLen;i++){tmp2=0===collator.compare(String.fromCharCode(bCharCode),String.fromCharCode(charCodeCache[i]))||bCharCode===wildcode||charCodeCache[i]===wildcode?tmp:tmp+subcost;tmp=arr[i];ret=arr[i]=tmp>ret?tmp2>ret?ret+1:tmp2:tmp2>tmp?tmp+1:tmp2;}}}return ret}else {return regLeven(a,b,options)}};},{}],9:[function(require,module,exports){var XRegExp=require("./xregexp");require("./unicode-base")(XRegExp);require("./unicode-categories")(XRegExp);module.exports=XRegExp;},{"./unicode-base":10,"./unicode-categories":11,"./xregexp":12}],10:[function(require,module,exports){module.exports=function(XRegExp){var unicode={};var dec=XRegExp._dec;var hex=XRegExp._hex;var pad4=XRegExp._pad4;function normalize(name){return name.replace(/[- _]+/g,"").toLowerCase()}function charCode(chr){var esc=/^\\[xu](.+)/.exec(chr);return esc?dec(esc[1]):chr.charCodeAt(chr.charAt(0)==="\\"?1:0)}function invertBmp(range){var output="";var lastEnd=-1;XRegExp.forEach(range,/(\\x..|\\u....|\\?[\s\S])(?:-(\\x..|\\u....|\\?[\s\S]))?/,function(m){var start=charCode(m[1]);if(start>lastEnd+1){output+="\\u"+pad4(hex(lastEnd+1));if(start>lastEnd+2){output+="-\\u"+pad4(hex(start-1));}}lastEnd=charCode(m[2]||m[1]);});if(lastEnd<65535){
    output+="\\u"+pad4(hex(lastEnd+1));if(lastEnd<65534){output+="-\\uFFFF";}}return output}function cacheInvertedBmp(slug){var prop="b!";return unicode[slug][prop]||(unicode[slug][prop]=invertBmp(unicode[slug].bmp))}XRegExp.addToken(/\\([pP])(?:{(\^?)([^}]*)}|([A-Za-z]))/,function(match,scope,flags){var ERR_DOUBLE_NEG="Invalid double negation ";var ERR_UNKNOWN_NAME="Unknown Unicode token ";var ERR_UNKNOWN_REF="Unicode token missing data ";var ERR_ASTRAL_ONLY="Astral mode required for Unicode token ";var isNegated=match[1]==="P"||!!match[2];var slug=normalize(match[4]||match[3]);var item=unicode[slug];if(match[1]==="P"&&match[2]){throw new SyntaxError(ERR_DOUBLE_NEG+match[0])}if(!unicode.hasOwnProperty(slug)){throw new SyntaxError(ERR_UNKNOWN_NAME+match[0])}if(item.inverseOf){slug=normalize(item.inverseOf);if(!unicode.hasOwnProperty(slug)){throw new ReferenceError(ERR_UNKNOWN_REF+match[0]+" -> "+item.inverseOf)}item=unicode[slug];isNegated=!isNegated;}if(!item.bmp){throw new SyntaxError(ERR_ASTRAL_ONLY+match[0])}return scope==="class"?isNegated?cacheInvertedBmp(slug):item.bmp:(isNegated?"[^":"[")+item.bmp+"]"},{scope:"all",optionalFlags:"A",leadChar:"\\"});XRegExp.addUnicodeData=function(data){var ERR_NO_NAME="Unicode token requires name";var ERR_NO_DATA="Unicode token has no character data ";var item;for(var i=0;i<data.length;++i){item=data[i];if(!item.name){throw new Error(ERR_NO_NAME)}if(!(item.inverseOf||item.bmp||item.astral)){throw new Error(ERR_NO_DATA+item.name)}unicode[normalize(item.name)]=item;if(item.alias){unicode[normalize(item.alias)]=item;}}XRegExp.cache.flush("patterns");};XRegExp._getUnicodeProperty=function(name){var slug=normalize(name);return unicode[slug]};};},{}],11:[function(require,module,exports){module.exports=function(XRegExp){if(!XRegExp.addUnicodeData){throw new ReferenceError("Unicode Base must be loaded before Unicode Categories")}XRegExp.addUnicodeData([{name:"L",alias:"Letter",bmp:"A-Za-zªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙՠ-ֈא-תׯ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࡠ-ࡪࢠ-ࢴࢶ-ࢽऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱৼਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡૹଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘ-ౚౠౡಀಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൔ-ൖൟ-ൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄຆ-ຊຌ-ຣລວ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏽᏸ-ᏽᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛱ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡸᢀ-ᢄᢇ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᦰ-ᧉᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᲀ-ᲈᲐ-ᲺᲽ-Ჿᳩ-ᳬᳮ-ᳳᳵᳶᳺᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕℙ-ℝℤΩℨK-ℭℯ-ℹℼ-ℿⅅ-ⅉⅎↃↄⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞⸯ々〆〱-〵〻〼ぁ-ゖゝ-ゟァ-ヺー-ヿㄅ-ㄯㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿯ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛥꜗ-ꜟꜢ-ꞈꞋ-ꞿꟂ-Ᶎꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꣽꣾꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭧꭰ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ"},{name:"N",alias:"Number",bmp:"0-9²³¹¼-¾٠-٩۰-۹߀-߉०-९০-৯৴-৹੦-੯૦-૯୦-୯୲-୷௦-௲౦-౯౸-౾೦-೯൘-൞൦-൸෦-෯๐-๙໐-໙༠-༳၀-၉႐-႙፩-፼ᛮ-ᛰ០-៩៰-៹᠐-᠙᥆-᥏᧐-᧚᪀-᪉᪐-᪙᭐-᭙᮰-᮹᱀-᱉᱐-᱙⁰⁴-⁹₀-₉⅐-ↂↅ-↉①-⒛⓪-⓿❶-➓⳽〇〡-〩〸-〺㆒-㆕㈠-㈩㉈-㉏㉑-㉟㊀-㊉㊱-㊿꘠-꘩ꛦ-ꛯ꠰-꠵꣐-꣙꤀-꤉꧐-꧙꧰-꧹꩐-꩙꯰-꯹０-９"}]);};},{}],12:[function(require,module,exports){var REGEX_DATA="xregexp";var features={astral:false,natives:false};var nativ={exec:RegExp.prototype.exec,test:RegExp.prototype.test,match:String.prototype.match,replace:String.prototype.replace,split:String.prototype.split};var fixed={};var regexCache={};var patternCache={};var tokens=[];var defaultScope="default";var classScope="class";var nativeTokens={"default":/\\(?:0(?:[0-3][0-7]{0,2}|[4-7][0-7]?)?|[1-9]\d*|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|\(\?(?:[:=!]|<[=!])|[?*+]\?|{\d+(?:,\d*)?}\??|[\s\S]/,"class":/\\(?:[0-3][0-7]{0,2}|[4-7][0-7]?|x[\dA-Fa-f]{2}|u(?:[\dA-Fa-f]{4}|{[\dA-Fa-f]+})|c[A-Za-z]|[\s\S])|[\s\S]/};var replacementToken=/\$(?:{([\w$]+)}|(\d\d?|[\s\S]))/g;var correctExecNpcg=nativ.exec.call(/()??/,"")[1]===undefined;var hasFlagsProp=/x/.flags!==undefined;var toString={}.toString;function hasNativeFlag(flag){var isSupported=true;try{new RegExp("",flag);}catch(exception){isSupported=false;}if(isSupported&&flag==="y"){return new RegExp("aa|.","y").test("b")}return isSupported}var hasNativeU=hasNativeFlag("u");var hasNativeY=hasNativeFlag("y");var registeredFlags={g:true,i:true,m:true,u:hasNativeU,y:hasNativeY};function augment(regex,captureNames,xSource,xFlags,isInternalOnly){var p;regex[REGEX_DATA]={captureNames:captureNames};if(isInternalOnly){return regex}if(regex.__proto__){regex.__proto__=XRegExp.prototype;}else {for(p in XRegExp.prototype){regex[p]=XRegExp.prototype[p];}}regex[REGEX_DATA].source=xSource;regex[REGEX_DATA].flags=xFlags?xFlags.split("").sort().join(""):xFlags;return regex}function clipDuplicates(str){return nativ.replace.call(str,/([\s\S])(?=[\s\S]*\1)/g,"")}function copyRegex(regex,options){if(!XRegExp.isRegExp(regex)){throw new TypeError("Type RegExp expected")}var xData=regex[REGEX_DATA]||{},flags=getNativeFlags(regex),flagsToAdd="",flagsToRemove="",xregexpSource=null,xregexpFlags=null;options=options||{};if(options.removeG){flagsToRemove+="g";}if(options.removeY){flagsToRemove+="y";}if(flagsToRemove){flags=nativ.replace.call(flags,new RegExp("["+flagsToRemove+"]+","g"),"");}if(options.addG){flagsToAdd+="g";}if(options.addY){flagsToAdd+="y";}if(flagsToAdd){flags=clipDuplicates(flags+flagsToAdd);}if(!options.isInternalOnly){if(xData.source!==undefined){xregexpSource=xData.source;}if(xData.flags!=null){xregexpFlags=flagsToAdd?clipDuplicates(xData.flags+flagsToAdd):xData.flags;}}regex=augment(new RegExp(options.source||regex.source,flags),hasNamedCapture(regex)?xData.captureNames.slice(0):null,xregexpSource,xregexpFlags,options.isInternalOnly);return regex}function dec(hex){return parseInt(hex,16)}function getNativeFlags(regex){return hasFlagsProp?regex.flags:nativ.exec.call(/\/([a-z]*)$/i,RegExp.prototype.toString.call(regex))[1]}function hasNamedCapture(regex){return !!(regex[REGEX_DATA]&&regex[REGEX_DATA].captureNames)}function hex(dec){return parseInt(dec,10).toString(16)}function indexOf(array,value){var len=array.length,i;for(i=0;i<len;++i){if(array[i]===value){return i}}return -1}function isType(value,type){return toString.call(value)==="[object "+type+"]"}function isQuantifierNext(pattern,pos,flags){return nativ.test.call(flags.indexOf("x")>-1?/^(?:\s|#[^#\n]*|\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/:/^(?:\(\?#[^)]*\))*(?:[?*+]|{\d+(?:,\d*)?})/,pattern.slice(pos))}function pad4(str){while(str.length<4){str="0"+str;}return str}function prepareFlags(pattern,flags){var i;if(clipDuplicates(flags)!==flags){throw new SyntaxError("Invalid duplicate regex flag "+flags)}pattern=nativ.replace.call(pattern,/^\(\?([\w$]+)\)/,function($0,$1){if(nativ.test.call(/[gy]/,$1)){throw new SyntaxError("Cannot use flag g or y in mode modifier "+$0)}flags=clipDuplicates(flags+$1);return ""});for(i=0;i<flags.length;++i){if(!registeredFlags[flags.charAt(i)]){throw new SyntaxError("Unknown regex flag "+flags.charAt(i))}}return {pattern:pattern,flags:flags}}function registerFlag(flag){if(!/^[\w$]$/.test(flag)){throw new Error("Flag must be a single character A-Za-z0-9_$")}registeredFlags[flag]=true;}function runTokens(pattern,flags,pos,scope,context){var i=tokens.length,leadChar=pattern.charAt(pos),result=null,match,t;while(i--){t=tokens[i];if(t.leadChar&&t.leadChar!==leadChar||t.scope!==scope&&t.scope!=="all"||t.flag&&flags.indexOf(t.flag)===-1){continue}match=XRegExp.exec(pattern,t.regex,pos,"sticky");if(match){result={matchLength:match[0].length,output:t.handler.call(context,match,scope,flags),reparse:t.reparse};break}}return result}function toObject(value){if(value==null){throw new TypeError("Cannot convert null or undefined to object")}return value}function XRegExp(pattern,flags){if(XRegExp.isRegExp(pattern)){if(flags!==undefined){throw new TypeError("Cannot supply flags when copying a RegExp")}return copyRegex(pattern)}pattern=pattern===undefined?"":String(pattern);flags=flags===undefined?"":String(flags);if(XRegExp.isInstalled("astral")&&flags.indexOf("A")===-1){flags+="A";}if(!patternCache[pattern]){patternCache[pattern]={};}if(!patternCache[pattern][flags]){var context={hasNamedCapture:false,captureNames:[]};var scope=defaultScope;var output="";var pos=0;var result;var applied=prepareFlags(pattern,flags);var appliedPattern=applied.pattern;var appliedFlags=applied.flags;while(pos<appliedPattern.length){do{result=runTokens(appliedPattern,appliedFlags,pos,scope,context);if(result&&result.reparse){appliedPattern=appliedPattern.slice(0,pos)+result.output+appliedPattern.slice(pos+result.matchLength);}}while(result&&result.reparse);if(result){output+=result.output;pos+=result.matchLength||1;}else {var token=XRegExp.exec(appliedPattern,nativeTokens[scope],pos,"sticky")[0];output+=token;pos+=token.length;if(token==="["&&scope===defaultScope){scope=classScope;}else if(token==="]"&&scope===classScope){scope=defaultScope;}}}patternCache[pattern][flags]={pattern:nativ.replace.call(output,/(?:\(\?:\))+/g,"(?:)"),flags:nativ.replace.call(appliedFlags,/[^gimuy]+/g,""),captures:context.hasNamedCapture?context.captureNames:null};}var generated=patternCache[pattern][flags];return augment(new RegExp(generated.pattern,generated.flags),generated.captures,pattern,flags)}XRegExp.prototype=new RegExp;XRegExp.version="3.1.1-next";XRegExp._clipDuplicates=clipDuplicates;XRegExp._hasNativeFlag=hasNativeFlag;XRegExp._dec=dec;XRegExp._hex=hex;XRegExp._pad4=pad4;XRegExp.addToken=function(regex,handler,options){options=options||{};var optionalFlags=options.optionalFlags,i;if(options.flag){registerFlag(options.flag);}if(optionalFlags){optionalFlags=nativ.split.call(optionalFlags,"");for(i=0;i<optionalFlags.length;++i){registerFlag(optionalFlags[i]);}}tokens.push({regex:copyRegex(regex,{addG:true,addY:hasNativeY,isInternalOnly:true}),handler:handler,scope:options.scope||defaultScope,flag:options.flag,reparse:options.reparse,leadChar:options.leadChar});XRegExp.cache.flush("patterns");};XRegExp.cache=function(pattern,flags){if(!regexCache[pattern]){regexCache[pattern]={};}return regexCache[pattern][flags]||(regexCache[pattern][flags]=XRegExp(pattern,flags))};XRegExp.cache.flush=function(cacheName){if(cacheName==="patterns"){patternCache={};}else {regexCache={};}};XRegExp.exec=function(str,regex,pos,sticky){var cacheKey="g",addY=false,fakeY=false,match,r2;addY=hasNativeY&&!!(sticky||regex.sticky&&sticky!==false);if(addY){cacheKey+="y";}else if(sticky){fakeY=true;cacheKey+="FakeY";}regex[REGEX_DATA]=regex[REGEX_DATA]||{};r2=regex[REGEX_DATA][cacheKey]||(regex[REGEX_DATA][cacheKey]=copyRegex(regex,{addG:true,addY:addY,source:fakeY?regex.source+"|()":undefined,removeY:sticky===false,isInternalOnly:true}));pos=pos||0;r2.lastIndex=pos;match=fixed.exec.call(r2,str);if(fakeY&&match&&match.pop()===""){match=null;}if(regex.global){regex.lastIndex=match?r2.lastIndex:0;}return match};XRegExp.isInstalled=function(feature){return !!features[feature]};XRegExp.isRegExp=function(value){return toString.call(value)==="[object RegExp]"};XRegExp.replace=function(str,search,replacement,scope){var isRegex=XRegExp.isRegExp(search),global=search.global&&scope!=="one"||scope==="all",cacheKey=(global?"g":"")+(search.sticky?"y":"")||"noGY",s2=search,result;if(isRegex){search[REGEX_DATA]=search[REGEX_DATA]||{};s2=search[REGEX_DATA][cacheKey]||(search[REGEX_DATA][cacheKey]=copyRegex(search,{addG:!!global,removeG:scope==="one",isInternalOnly:true}));}else if(global){s2=new RegExp(XRegExp.escape(String(search)),"g");}result=fixed.replace.call(toObject(str),s2,replacement);if(isRegex&&search.global){search.lastIndex=0;}return result};fixed.exec=function(str){var origLastIndex=this.lastIndex,match=nativ.exec.apply(this,arguments),name,r2,i;if(match){if(!correctExecNpcg&&match.length>1&&indexOf(match,"")>-1){r2=copyRegex(this,{removeG:true,isInternalOnly:true});nativ.replace.call(String(str).slice(match.index),r2,function(){var len=arguments.length,i;for(i=1;i<len-2;++i){if(arguments[i]===undefined){match[i]=undefined;}}});}if(this[REGEX_DATA]&&this[REGEX_DATA].captureNames){for(i=1;i<match.length;++i){name=this[REGEX_DATA].captureNames[i-1];if(name){match[name]=match[i];}}}if(this.global&&!match[0].length&&this.lastIndex>match.index){this.lastIndex=match.index;}}if(!this.global){this.lastIndex=origLastIndex;}return match};fixed.replace=function(search,replacement){var isRegex=XRegExp.isRegExp(search),origLastIndex,captureNames,result;if(isRegex){if(search[REGEX_DATA]){captureNames=search[REGEX_DATA].captureNames;}origLastIndex=search.lastIndex;}else {search+="";}if(isType(replacement,"Function")){result=nativ.replace.call(String(this),search,function(){var args=arguments,i;if(captureNames){args[0]=new String(args[0]);for(i=0;i<captureNames.length;++i){if(captureNames[i]){args[0][captureNames[i]]=args[i+1];}}}if(isRegex&&search.global){search.lastIndex=args[args.length-2]+args[0].length;}return replacement.apply(undefined,args)});}else {result=nativ.replace.call(this==null?this:String(this),search,function(){var args=arguments;return nativ.replace.call(String(replacement),replacementToken,function($0,$1,$2){var n;if($1){n=+$1;if(n<=args.length-3){return args[n]||""}n=captureNames?indexOf(captureNames,$1):-1;if(n<0){throw new SyntaxError("Backreference to undefined group "+$0)}return args[n+1]||""}if($2==="$"){return "$"}if($2==="&"||+$2===0){return args[0]}if($2==="`"){return args[args.length-1].slice(0,args[args.length-2])}if($2==="'"){return args[args.length-1].slice(args[args.length-2]+args[0].length)}$2=+$2;if(!isNaN($2)){if($2>args.length-3){throw new SyntaxError("Backreference to undefined group "+$0)}return args[$2]||""}throw new SyntaxError("Invalid token "+$0)})});}if(isRegex){if(search.global){search.lastIndex=0;}else {search.lastIndex=origLastIndex;}}return result};fixed.split=function(separator,limit){if(!XRegExp.isRegExp(separator)){return nativ.split.apply(this,arguments)}var str=String(this),output=[],origLastIndex=separator.lastIndex,lastLastIndex=0,lastLength;limit=(limit===undefined?-1:limit)>>>0;XRegExp.forEach(str,separator,function(match){if(match.index+match[0].length>lastLastIndex){output.push(str.slice(lastLastIndex,match.index));if(match.length>1&&match.index<str.length){Array.prototype.push.apply(output,match.slice(1));}lastLength=match[0].length;lastLastIndex=match.index+lastLength;}});if(lastLastIndex===str.length){if(!nativ.test.call(separator,"")||lastLength){output.push("");}}else {output.push(str.slice(lastLastIndex));}separator.lastIndex=origLastIndex;return output.length>limit?output.slice(0,limit):output};XRegExp.addToken(/\\([ABCE-RTUVXYZaeg-mopqyz]|c(?![A-Za-z])|u(?![\dA-Fa-f]{4}|{[\dA-Fa-f]+})|x(?![\dA-Fa-f]{2}))/,function(match,scope){if(match[1]==="B"&&scope===defaultScope){return match[0]}throw new SyntaxError("Invalid escape "+match[0])},{scope:"all",leadChar:"\\"});XRegExp.addToken(/\\u{([\dA-Fa-f]+)}/,function(match,scope,flags){var code=dec(match[1]);if(code>1114111){throw new SyntaxError("Invalid Unicode code point "+match[0])}if(code<=65535){return "\\u"+pad4(hex(code))}if(hasNativeU&&flags.indexOf("u")>-1){return match[0]}throw new SyntaxError("Cannot use Unicode code point above \\u{FFFF} without flag u")},{scope:"all",leadChar:"\\"});XRegExp.addToken(/\[(\^?)\]/,function(match){return match[1]?"[\\s\\S]":"\\b\\B"},{leadChar:"["});XRegExp.addToken(/\(\?#[^)]*\)/,function(match,scope,flags){return isQuantifierNext(match.input,match.index+match[0].length,flags)?"":"(?:)"},{leadChar:"("});XRegExp.addToken(/\s+|#[^\n]*\n?/,function(match,scope,flags){return isQuantifierNext(match.input,match.index+match[0].length,flags)?"":"(?:)"},{flag:"x"});XRegExp.addToken(/\./,function(){return "[\\s\\S]"},{flag:"s",leadChar:"."});XRegExp.addToken(/\\k<([\w$]+)>/,function(match){var index=isNaN(match[1])?indexOf(this.captureNames,match[1])+1:+match[1],endIndex=match.index+match[0].length;if(!index||index>this.captureNames.length){throw new SyntaxError("Backreference to undefined group "+match[0])}return "\\"+index+(endIndex===match.input.length||isNaN(match.input.charAt(endIndex))?"":"(?:)")},{leadChar:"\\"});XRegExp.addToken(/\\(\d+)/,function(match,scope){if(!(scope===defaultScope&&/^[1-9]/.test(match[1])&&+match[1]<=this.captureNames.length)&&match[1]!=="0"){throw new SyntaxError("Cannot use octal escape or backreference to undefined group "+match[0])}return match[0]},{scope:"all",leadChar:"\\"});XRegExp.addToken(/\(\?P?<([\w$]+)>/,function(match){if(!isNaN(match[1])){throw new SyntaxError("Cannot use integer as capture name "+match[0])}if(match[1]==="length"||match[1]==="__proto__"){throw new SyntaxError("Cannot use reserved word as capture name "+match[0])}if(indexOf(this.captureNames,match[1])>-1){throw new SyntaxError("Cannot use same name for multiple groups "+match[0])}this.captureNames.push(match[1]);this.hasNamedCapture=true;return "("},{leadChar:"("});XRegExp.addToken(/\((?!\?)/,function(match,scope,flags){if(flags.indexOf("n")>-1){return "(?:"}this.captureNames.push(null);return "("},{optionalFlags:"n",leadChar:"("});module.exports=XRegExp;},{}],13:[function(require,module,exports){module.exports=require("./lib/heap");},{"./lib/heap":14}],14:[function(require,module,exports){(function(){var Heap,defaultCmp,floor,heapify,heappop,heappush,heappushpop,heapreplace,insort,min,nlargest,nsmallest,updateItem,_siftdown,_siftup;floor=Math.floor,min=Math.min;defaultCmp=function(x,y){if(x<y){return -1}if(x>y){return 1}return 0};insort=function(a,x,lo,hi,cmp){var mid;if(lo==null){lo=0;}if(cmp==null){cmp=defaultCmp;}if(lo<0){throw new Error("lo must be non-negative")}if(hi==null){hi=a.length;}while(lo<hi){mid=floor((lo+hi)/2);if(cmp(x,a[mid])<0){hi=mid;}else {lo=mid+1;}}return [].splice.apply(a,[lo,lo-lo].concat(x)),x};heappush=function(array,item,cmp){if(cmp==null){cmp=defaultCmp;}array.push(item);return _siftdown(array,0,array.length-1,cmp)};heappop=function(array,cmp){var lastelt,returnitem;if(cmp==null){cmp=defaultCmp;}lastelt=array.pop();if(array.length){returnitem=array[0];array[0]=lastelt;_siftup(array,0,cmp);}else {returnitem=lastelt;}return returnitem};heapreplace=function(array,item,cmp){var returnitem;if(cmp==null){cmp=defaultCmp;}returnitem=array[0];array[0]=item;_siftup(array,0,cmp);return returnitem};heappushpop=function(array,item,cmp){var _ref;if(cmp==null){cmp=defaultCmp;}if(array.length&&cmp(array[0],item)<0){_ref=[array[0],item],item=_ref[0],array[0]=_ref[1];_siftup(array,0,cmp);}return item};heapify=function(array,cmp){var i,_i,_len,_ref1,_results,_results1;if(cmp==null){cmp=defaultCmp;}_ref1=function(){_results1=[];for(var _j=0,_ref=floor(array.length/2);0<=_ref?_j<_ref:_j>_ref;0<=_ref?_j++:_j--){_results1.push(_j);}return _results1}.apply(this).reverse();_results=[];for(_i=0,_len=_ref1.length;_i<_len;_i++){i=_ref1[_i];_results.push(_siftup(array,i,cmp));}return _results};updateItem=function(array,item,cmp){var pos;if(cmp==null){cmp=defaultCmp;}pos=array.indexOf(item);if(pos===-1){return}_siftdown(array,0,pos,cmp);return _siftup(array,pos,cmp)};nlargest=function(array,n,cmp){var elem,result,_i,_len,_ref;if(cmp==null){cmp=defaultCmp;}result=array.slice(0,n);if(!result.length){return result}heapify(result,cmp);_ref=array.slice(n);for(_i=0,_len=_ref.length;_i<_len;_i++){elem=_ref[_i];heappushpop(result,elem,cmp);}return result.sort(cmp).reverse()};nsmallest=function(array,n,cmp){var elem,i,los,result,_i,_j,_len,_ref,_ref1,_results;if(cmp==null){cmp=defaultCmp;}if(n*10<=array.length){result=array.slice(0,n).sort(cmp);if(!result.length){return result}los=result[result.length-1];_ref=array.slice(n);for(_i=0,_len=_ref.length;_i<_len;_i++){elem=_ref[_i];if(cmp(elem,los)<0){insort(result,elem,0,null,cmp);result.pop();los=result[result.length-1];}}return result}heapify(array,cmp);_results=[];for(i=_j=0,_ref1=min(n,array.length);0<=_ref1?_j<_ref1:_j>_ref1;i=0<=_ref1?++_j:--_j){_results.push(heappop(array,cmp));}return _results};_siftdown=function(array,startpos,pos,cmp){var newitem,parent,parentpos;if(cmp==null){cmp=defaultCmp;}newitem=array[pos];while(pos>startpos){parentpos=pos-1>>1;parent=array[parentpos];if(cmp(newitem,parent)<0){array[pos]=parent;pos=parentpos;continue}break}return array[pos]=newitem};_siftup=function(array,pos,cmp){var childpos,endpos,newitem,rightpos,startpos;if(cmp==null){cmp=defaultCmp;}endpos=array.length;startpos=pos;newitem=array[pos];childpos=2*pos+1;while(childpos<endpos){rightpos=childpos+1;if(rightpos<endpos&&!(cmp(array[childpos],array[rightpos])<0)){childpos=rightpos;}array[pos]=array[childpos];pos=childpos;childpos=2*pos+1;}array[pos]=newitem;return _siftdown(array,startpos,pos,cmp)};Heap=function(){Heap.push=heappush;Heap.pop=heappop;Heap.replace=heapreplace;Heap.pushpop=heappushpop;Heap.heapify=heapify;Heap.updateItem=updateItem;Heap.nlargest=nlargest;Heap.nsmallest=nsmallest;function Heap(cmp){this.cmp=cmp!=null?cmp:defaultCmp;this.nodes=[];}Heap.prototype.push=function(x){return heappush(this.nodes,x,this.cmp)};Heap.prototype.pop=function(){return heappop(this.nodes,this.cmp)};Heap.prototype.peek=function(){return this.nodes[0]};Heap.prototype.contains=function(x){return this.nodes.indexOf(x)!==-1};Heap.prototype.replace=function(x){return heapreplace(this.nodes,x,this.cmp)};Heap.prototype.pushpop=function(x){return heappushpop(this.nodes,x,this.cmp)};Heap.prototype.heapify=function(){return heapify(this.nodes,this.cmp)};Heap.prototype.updateItem=function(x){return updateItem(this.nodes,x,this.cmp)};Heap.prototype.clear=function(){return this.nodes=[]};Heap.prototype.empty=function(){return this.nodes.length===0};Heap.prototype.size=function(){return this.nodes.length};Heap.prototype.clone=function(){var heap;heap=new Heap;heap.nodes=this.nodes.slice(0);return heap};Heap.prototype.toArray=function(){return this.nodes.slice(0)};Heap.prototype.insert=Heap.prototype.push;Heap.prototype.top=Heap.prototype.peek;Heap.prototype.front=Heap.prototype.peek;Heap.prototype.has=Heap.prototype.contains;Heap.prototype.copy=Heap.prototype.clone;return Heap}();(function(root,factory){if(typeof exports==="object"){return module.exports=factory()}else {return root.Heap=factory()}})(this,function(){return Heap});}).call(this);},{}],15:[function(require,module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error("setTimeout has not been defined")}function defaultClearTimeout(){throw new Error("clearTimeout has not been defined")}(function(){try{if(typeof setTimeout==="function"){cachedSetTimeout=setTimeout;}else {cachedSetTimeout=defaultSetTimout;}}catch(e){cachedSetTimeout=defaultSetTimout;}try{if(typeof clearTimeout==="function"){cachedClearTimeout=clearTimeout;}else {cachedClearTimeout=defaultClearTimeout;}}catch(e){cachedClearTimeout=defaultClearTimeout;}})();function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0)}if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0)}try{return cachedSetTimeout(fun,0)}catch(e){try{return cachedSetTimeout.call(null,fun,0)}catch(e){return cachedSetTimeout.call(this,fun,0)}}}function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker)}if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker)}try{return cachedClearTimeout(marker)}catch(e){try{return cachedClearTimeout.call(null,marker)}catch(e){return cachedClearTimeout.call(this,marker)}}}var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return}draining=false;if(currentQueue.length){queue=currentQueue.concat(queue);}else {queueIndex=-1;}if(queue.length){drainQueue();}}function drainQueue(){if(draining){return}var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run();}}queueIndex=-1;len=queue.length;}currentQueue=null;draining=false;runClearTimeout(timeout);}process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}}queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue);}};function Item(fun,array){this.fun=fun;this.array=array;}Item.prototype.run=function(){this.fun.apply(null,this.array);};process.title="browser";process.browser=true;process.env={};process.argv=[];process.version="";process.versions={};function noop(){}process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return []};process.binding=function(name){throw new Error("process.binding is not supported")};process.cwd=function(){return "/"};process.chdir=function(dir){throw new Error("process.chdir is not supported")};process.umask=function(){return 0};},{}],16:[function(require,module,exports){(function(process,global){(function(global,undefined$1){if(global.setImmediate){return}var nextHandle=1;var tasksByHandle={};var currentlyRunningATask=false;var doc=global.document;var registerImmediate;function setImmediate(callback){if(typeof callback!=="function"){callback=new Function(""+callback);}var args=new Array(arguments.length-1);for(var i=0;i<args.length;i++){args[i]=arguments[i+1];}var task={callback:callback,args:args};tasksByHandle[nextHandle]=task;registerImmediate(nextHandle);return nextHandle++}function clearImmediate(handle){delete tasksByHandle[handle];}function run(task){var callback=task.callback;var args=task.args;switch(args.length){case 0:callback();break;case 1:callback(args[0]);break;case 2:callback(args[0],args[1]);break;case 3:callback(args[0],args[1],args[2]);break;default:callback.apply(undefined$1,args);break}}function runIfPresent(handle){if(currentlyRunningATask){setTimeout(runIfPresent,0,handle);}else {var task=tasksByHandle[handle];if(task){currentlyRunningATask=true;try{run(task);}finally{clearImmediate(handle);currentlyRunningATask=false;}}}}function installNextTickImplementation(){registerImmediate=function(handle){process.nextTick(function(){runIfPresent(handle);});};}function canUsePostMessage(){if(global.postMessage&&!global.importScripts){var postMessageIsAsynchronous=true;var oldOnMessage=global.onmessage;global.onmessage=function(){postMessageIsAsynchronous=false;};global.postMessage("","*");global.onmessage=oldOnMessage;return postMessageIsAsynchronous}}function installPostMessageImplementation(){var messagePrefix="setImmediate$"+Math.random()+"$";var onGlobalMessage=function(event){if(event.source===global&&typeof event.data==="string"&&event.data.indexOf(messagePrefix)===0){runIfPresent(+event.data.slice(messagePrefix.length));}};if(global.addEventListener){global.addEventListener("message",onGlobalMessage,false);}else {global.attachEvent("onmessage",onGlobalMessage);}registerImmediate=function(handle){global.postMessage(messagePrefix+handle,"*");};}function installMessageChannelImplementation(){var channel=new MessageChannel;channel.port1.onmessage=function(event){var handle=event.data;runIfPresent(handle);};registerImmediate=function(handle){channel.port2.postMessage(handle);};}function installReadyStateChangeImplementation(){var html=doc.documentElement;registerImmediate=function(handle){var script=doc.createElement("script");script.onreadystatechange=function(){runIfPresent(handle);script.onreadystatechange=null;html.removeChild(script);script=null;};html.appendChild(script);};}function installSetTimeoutImplementation(){registerImmediate=function(handle){setTimeout(runIfPresent,0,handle);};}var attachTo=Object.getPrototypeOf&&Object.getPrototypeOf(global);attachTo=attachTo&&attachTo.setTimeout?attachTo:global;if({}.toString.call(global.process)==="[object process]"){installNextTickImplementation();}else if(canUsePostMessage()){installPostMessageImplementation();}else if(global.MessageChannel){installMessageChannelImplementation();}else if(doc&&"onreadystatechange"in doc.createElement("script")){installReadyStateChangeImplementation();}else {installSetTimeoutImplementation();}attachTo.setImmediate=setImmediate;attachTo.clearImmediate=clearImmediate;})(typeof self==="undefined"?typeof global==="undefined"?this:global:self);}).call(this,require("_process"),typeof commonjsGlobal!=="undefined"?commonjsGlobal:typeof self!=="undefined"?self:typeof window!=="undefined"?window:{});},{_process:15}],17:[function(require,module,exports){if(!String.fromCodePoint){(function(){var defineProperty=function(){try{var object={};var $defineProperty=Object.defineProperty;var result=$defineProperty(object,object,object)&&$defineProperty;}catch(error){}return result}();var stringFromCharCode=String.fromCharCode;var floor=Math.floor;var fromCodePoint=function(_){var MAX_SIZE=16384;var codeUnits=[];var highSurrogate;var lowSurrogate;var index=-1;var length=arguments.length;if(!length){return ""}var result="";while(++index<length){var codePoint=Number(arguments[index]);if(!isFinite(codePoint)||codePoint<0||codePoint>1114111||floor(codePoint)!=codePoint){throw RangeError("Invalid code point: "+codePoint)}if(codePoint<=65535){codeUnits.push(codePoint);}else {codePoint-=65536;highSurrogate=(codePoint>>10)+55296;lowSurrogate=codePoint%1024+56320;codeUnits.push(highSurrogate,lowSurrogate);}if(index+1==length||codeUnits.length>MAX_SIZE){result+=stringFromCharCode.apply(null,codeUnits);codeUnits.length=0;}}return result};if(defineProperty){defineProperty(String,"fromCodePoint",{value:fromCodePoint,configurable:true,writable:true});}else {String.fromCodePoint=fromCodePoint;}})();}},{}],18:[function(require,module,exports){if(!String.prototype.codePointAt){(function(){var defineProperty=function(){try{var object={};var $defineProperty=Object.defineProperty;var result=$defineProperty(object,object,object)&&$defineProperty;}catch(error){}return result}();var codePointAt=function(position){if(this==null){throw TypeError()}var string=String(this);var size=string.length;var index=position?Number(position):0;if(index!=index){index=0;}if(index<0||index>=size){return undefined}var first=string.charCodeAt(index);var second;if(first>=55296&&first<=56319&&size>index+1){second=string.charCodeAt(index+1);if(second>=56320&&second<=57343){return (first-55296)*1024+second-56320+65536}}return first};if(defineProperty){defineProperty(String.prototype,"codePointAt",{value:codePointAt,configurable:true,writable:true});}else {String.prototype.codePointAt=codePointAt;}})();}},{}]},{},[1])(1)});
    });

    async function searchIngredients(ingredient){
    	if(ingredient){
    		ingredient = ingredient.toLowerCase();
    		ingredient = ingredient.replace(/\s/g,'');
    		ingredient = ingredient.split(',');
    	}
    	let response = await axios$1.get(`${url}/ingredients`).catch(error => console.log(error));
    	let data = response.data;

    	let options =  {scorer: fuzzball_umd_min.token_set_ratio};
    	let choices = data.map(item => item.name);
    	let confindenceLevel = 80;
    	let nameLocation = 0;
    	let scoreLocation = 1;

    	let extracted = [];
    	//testing fuzzy matching
    	if(ingredient){
    		for (var i = 0; i < ingredient.length;i++){
    			let fuzz = fuzzball_umd_min.extract(ingredient[i], choices, options);
    			for (var x = 0; x< fuzz.length; x++){
    				if(fuzz[x][scoreLocation] >= confindenceLevel){
    					extracted.push(fuzz[x][nameLocation]);
    				}
    			} 
    		}
    	}

    	let ing = [];
    	let filteredData = [];
    	let ingredient_id = [];
    	if(extracted){
    		for (let x = 0; x< extracted.length; x++) {
    			filteredData.push(data.filter(item => item.name == extracted[x]));
    		} 
    		//number of items in the array, increases after a ',' due to split
    		let numSearches = filteredData.length;
    		filteredData = filteredData.flat();
    		let matchedSearches = filteredData.length;
    		if (filteredData.length == 0) ; else {
    				for (let i = 0; i < numSearches; i++){
    					if(filteredData[i]){
    						ingredient_id.push(filteredData[i].ingredient_id);
    						ingredient_id = ingredient_id.filter(function(item, pos) {
        					return ingredient_id.indexOf(item) == pos	
    					});
    					} else {
    						ingredient_id = [''];
    					}
    				}
    				if (ingredient_id != ''){
    				ing = searchInventories(ingredient_id);
    			} else {
    				ing = '';
    			}
    			}
    		}
    	return ing
    }

    //OLD RESPONSE BEFORE MULTIPLE WORDS
    // let response = await axios.get(`${url}/ingredients`).catch(error => console.log(error))
    // 	let data = response.data
    // 	let ing = []
    // 	let filteredData = []
    // 	filteredData = data.filter(item => item.name == ingredient)
    // 	if (filteredData.length == 0) {
    // 	} else {
    // 		let ingredient_id = filteredData[0].ingredient_id
    // 		ing = searchInventories(ingredient_id)
    // 	}
    // 	console.log(ing)
    // 	return ing
    // }

    async function ingredientInfo(ingredient){
    	if(ingredient){
    		ingredient = ingredient.toLowerCase();
    		ingredient = ingredient.replace(/\s/g,'');
    		ingredient = ingredient.split(',');
    	}
    	let response = await axios$1.get(`${url}/ingredients`).catch(error => console.log(error));
    	let data = response.data;
    	let filteredData = [];
    	if(ingredient){
    		for (let x = 0; x< ingredient.length; x++) {
    			filteredData.push(data.filter(item => item.name == ingredient[x]));
    		}
    	}
    	if (filteredData.length != 0){
    		return filteredData.flat()
    	} 
    	// else {
    	// 	return []
    	// }
    }

    function optimiseRoute(result, distances){
    	let trial = [];
    	for(var x = 0; x < result.length; x++){
        trial.push(result[x]);
      }
      let locationsDistanceObj = result.map(rslt => Object.assign({}, rslt, {
        distance: distances.filter(dst => dst.id === rslt[0].id).map(dst => dst.distance)
      }));


      // get cost mean
      let cost = 0;
      for (let x = 0; x < locationsDistanceObj.length; x++){
        cost += locationsDistanceObj[x].basketPrice;
      }
      let priceMean = cost / locationsDistanceObj.length;


      //get distance mean
      let distance = 0;
      for(let i = 0; i < locationsDistanceObj.length; i++){
        distance += locationsDistanceObj[i].distance[0];
      }
      let distanceMean = distance / locationsDistanceObj.length;
      

      //This is currently the algo for best route basted on distance from mean
      let optimisedList = [];
      for (let j = 0; j < locationsDistanceObj.length; j++){
        optimisedList.push({
          ...locationsDistanceObj[j],
          priorityNumber: (Math.abs(locationsDistanceObj[j].distance[0] - distanceMean) * Math.abs(locationsDistanceObj[j].basketPrice - priceMean))*100
        });
      }

      //This sorts via the shortest distance
      // locationsDistanceObj.sort((a,b) => parseFloat(a.distance[0]) - parseFloat(b.distance[0]))


      //This sorts via the lowest price
      // let lowestPrice = locationsDistanceObj.sort((a,b) => parseFloat(a.basketPrice) - parseFloat(b.basketPrice))

      //This sorts via the smallest priority number first
      optimisedList.sort((a,b) => parseFloat(a.priorityNumber) - parseFloat(b.priorityNumber));


      return optimisedList
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

    let lat = 51.52641389999999; 
    let lng = -0.051092;

    function calculateDistance(distanceObj){

    	let currentLatRadians = distanceObj.currentLat*Math.PI/180;
    	let currentLngRadians = distanceObj.currentLng*Math.PI/180;
    	let newLatRadians = distanceObj.newLat*Math.PI/180;
    	let newLngRadians = distanceObj.newLng*Math.PI/180;
    	let distance = 3959 * Math.acos(Math.cos(currentLatRadians) * Math.cos(newLatRadians) * Math.cos(currentLngRadians - newLngRadians) + Math.sin(currentLatRadians) * Math.sin(newLatRadians));

    	// console.log(Math.round(distance*10)/10)
    	return {distance: Math.round(distance*100)/100, id:distanceObj.id}
    }

    let clicked = false;
    let map, myLocation, latlngBounds;
    let markers = [];
    let marker = [];
    let directionsDisplay = new google.maps.DirectionsRenderer();
    let distance = [];
    let distances = [];


    // EXPORT FUNCTIONS

    // Draws current location on map (currently hardcoded to my house)
    function mapCurrentLocation(){

    	//Creates location
    	myLocation = new google.maps.LatLng(lat, lng);

    	//Creates default map with styling
    	map = new google.maps.Map(document.getElementById('interactiveMap'), {
    		center: new google.maps.LatLng(lat,lng),
    		disableDefaultUI: true,
    		zoom: 17,
    		mapTypeId: google.maps.MapTypeId.ROADMAP,
    		styles: brownStyles,
    	});

    	//Creates marker on default map
    	marker = new google.maps.Marker({
    		position: myLocation,
    		map: map,
    		title: "You are Here",
    		animation: google.maps.Animation.DROP,
    		// icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
    	});

    	//Creates Info window with content
    	let info = new google.maps.InfoWindow({
    		content: "Current Location"
    	});

    	//Lets the info window appear and close on click
    	google.maps.event.addListener(marker, "click", function(){
    		clicked = ! clicked; 
    		if (clicked == true) {
    			info.open(map, marker);
    		} else {
    			info.close(map, marker);
    		}
    	});
    }
    	
    //Centers the map and resets the zoom
    function centerMap() {
    	map.setCenter({
    		lat: lat,
    		lng: lng
    	});
    	map.setZoom(17);
    }

    //Takes in an array of objects clears current markers and sets new ones
    function createLocationMarkers(latLng, travelMode){
    	//Initiates map bounds
    	latlngBounds = new google.maps.LatLngBounds();

    	//Clears all current markers
    	clearMarkers();

    	let distanceObj = [];

    	//Loop through array and create markers
    	for (var x = 0; x < latLng.length;x++){
    		let locationLat = latLng[x][0].lat;
    		let locationLng = latLng[x][0].lng;
    		let locationName = latLng[x][0].name;

    		//Use lat, lng and name to create markers function
    		createMarkers(locationLat, locationLng, locationName);

    		//Consolidate information needed to calculate distance into the distanceObj
    		distanceObj.push({
    			id: latLng[x][0].id,
    			currentLat: lat,
    			currentLng: lng,
    			newLat: locationLat,
    			newLng: locationLng,
    			travelMode:travelMode
    		});

    		//Use information in object to return distance and id from Calculate Distance function
    		distances.push(getDistance(distanceObj[x]));
    	}
    	
    	distances = distances.reduce((items, item) => items.find(x => x.id === item.id) ? [...items] : [...items, item], []);
    	//Resize map to fit all bounds
    	map.fitBounds(latlngBounds);
    	return distances
    }

    //Clears all other markers for use when drawing path
    function clearMarkers(){
    	if (markers) {
    		for(let i in markers) {
    			markers[i].setMap(null);
    			centerMap();
    		}
    	markers = [];
    	}
    }

    //Gets locations and draws paths 
    function drawPath(newLat, newLng, selectedMode) {
    	clearMarkers();
    	clearCurrentMarker();

    	if (directionsDisplay != null) {
            directionsDisplay.setMap(null);
            directionsDisplay = null;
        }

    	let directionsService = new google.maps.DirectionsService();
    	let poly = new google.maps.Polyline({
    		strokeColor: "#FF0000",
    		strokeWeight: 3
    	});

    	let request = {
    		origin: new google.maps.LatLng(lat, lng),
    		destination: new google.maps.LatLng(newLat,newLng),
    		travelMode: selectedMode
    	};

    	directionsService.route(request, function(response, status){
    		if (status == google.maps.DirectionsStatus.OK) {
    			directionsDisplay = new google.maps.DirectionsRenderer({
    				map:map,
    				polylineOptions: poly, 
    				directions: response
    			});
    		}
    	});
    }


    //Gets shop location info and updates small elements with distance and duration
    function getTimeTaken(i,shopLat, shopLng, selectedMode){
    	const origin = {lat,lng};
    	const destination = {lat: shopLat, lng: shopLng};
    	if(destination){
    	const service = new google.maps.DistanceMatrixService();
      	service.getDistanceMatrix({
          origins: [origin],
          destinations: [destination],
          travelMode: selectedMode,
          unitSystem: google.maps.UnitSystem.IMPERIAL,
          avoidHighways: false,
          avoidTolls: false,
        },
        (response, status) => {
        if (status !== "OK") {
        	alert("Error was: " + status);
        	} else {
        		if(response){
            	const originList = response.originAddresses;
    	        const destinationList = response.destinationAddresses;
    	        const durationDiv = document.getElementById(`duration${i}`);
    	        const distanceDiv = document.getElementById(`distance${i}`);
    	        distanceDiv.innerHTML = 'Distance: <br>' + response.rows[0].elements[0].distance.text;
    	        durationDiv.innerHTML = 'Duration: <br>' + response.rows[0].elements[0].duration.text;
    	   	 }
    		}
    	});
      }
    }

    // SUPPORT FUNCTIONS

    //Creates and displays map markers
    function createMarkers(locationLat,locationLng, locationName){
    	let markerLocation = new google.maps.LatLng(locationLat, locationLng);
    	let marker = new google.maps.Marker({
    		position:markerLocation,
    		map:map
    	});
    	markers.push(marker);
    	latlngBounds.extend(markerLocation);
    	let infoWindow = new google.maps.InfoWindow({
    	 	content: locationName
     	});
     	google.maps.event.addListener(marker, 'click', function(){
    	 	clicked = ! clicked; 
    		if (clicked == true) {
    			infoWindow.open(map, marker);
    		} else {
    			infoWindow.close(map, marker);
    		}
    	});
    }

    //Clears current location marker for use when drawing path
    function clearCurrentMarker(){
    	marker.setMap(null);
    }

    //Gets distances as the crow flies for use by sorting
    function getDistance(distanceObj){
    	let dist = calculateDistance(distanceObj);
    	return dist
    }

    /* src/pages/Home.svelte generated by Svelte v3.31.0 */

    const file$1 = "src/pages/Home.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[22] = list[i];
    	child_ctx[24] = i;
    	return child_ctx;
    }

    // (140:22) 
    function create_if_block_5(ctx) {
    	let div;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-bus transportButton");
    			add_location(i, file$1, 142, 6, 4403);
    			attr_dev(button, "class", "transportContainer");
    			add_location(button, file$1, 141, 4, 4312);
    			add_location(div, file$1, 140, 2, 4302);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler_3*/ ctx[11]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(140:22) ",
    		ctx
    	});

    	return block;
    }

    // (134:22) 
    function create_if_block_4(ctx) {
    	let div;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-car transportButton");
    			add_location(i, file$1, 136, 6, 4215);
    			attr_dev(button, "class", "transportContainer");
    			add_location(button, file$1, 135, 4, 4124);
    			add_location(div, file$1, 134, 2, 4114);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler_2*/ ctx[10]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(134:22) ",
    		ctx
    	});

    	return block;
    }

    // (128:22) 
    function create_if_block_3(ctx) {
    	let div;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-biking transportButton");
    			add_location(i, file$1, 130, 6, 4024);
    			attr_dev(button, "class", "transportContainer");
    			add_location(button, file$1, 129, 4, 3933);
    			add_location(div, file$1, 128, 2, 3923);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler_1*/ ctx[9]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(128:22) ",
    		ctx
    	});

    	return block;
    }

    // (122:0) {#if toggle == 1}
    function create_if_block_2(ctx) {
    	let div;
    	let button;
    	let i;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			i = element("i");
    			attr_dev(i, "class", "fas fa-walking transportButton");
    			add_location(i, file$1, 124, 6, 3832);
    			attr_dev(button, "class", "transportContainer");
    			add_location(button, file$1, 123, 4, 3741);
    			add_location(div, file$1, 122, 2, 3731);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, i);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", prevent_default(/*click_handler*/ ctx[8]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(122:0) {#if toggle == 1}",
    		ctx
    	});

    	return block;
    }

    // (194:27) 
    function create_if_block_1$1(ctx) {
    	let li;
    	let div;
    	let h5;
    	let t1;
    	let small0;
    	let t2;
    	let small1;

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			h5 = element("h5");
    			h5.textContent = "One or more of your items are not within this radius...";
    			t1 = space();
    			small0 = element("small");
    			t2 = space();
    			small1 = element("small");
    			attr_dev(h5, "class", "mb-1");
    			add_location(h5, file$1, 196, 10, 6618);
    			attr_dev(small0, "class", "text-muted");
    			add_location(small0, file$1, 197, 10, 6706);
    			attr_dev(small1, "class", "text-muted");
    			add_location(small1, file$1, 198, 10, 6751);
    			attr_dev(div, "class", "d-flex w-100 justify-content-between");
    			add_location(div, file$1, 195, 8, 6557);
    			attr_dev(li, "class", "list-group-item list-group-item-action");
    			set_style(li, "z-index", "1");
    			set_style(li, "margin-top", "20px");
    			add_location(li, file$1, 194, 5, 6460);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, h5);
    			append_dev(div, t1);
    			append_dev(div, small0);
    			append_dev(div, t2);
    			append_dev(div, small1);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(194:27) ",
    		ctx
    	});

    	return block;
    }

    // (167:2) {#if locationsDistanceObj.length != 0}
    function create_if_block$1(ctx) {
    	let each_1_anchor;
    	let each_value = /*locationsDistanceObj*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*locationsDistanceObj, routeMe, selectedMode*/ 74) {
    				each_value = /*locationsDistanceObj*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(167:2) {#if locationsDistanceObj.length != 0}",
    		ctx
    	});

    	return block;
    }

    // (168:4) {#each locationsDistanceObj as shop, i}
    function create_each_block(ctx) {
    	let li;
    	let div;
    	let h5;
    	let t0;
    	let t1_value = /*shop*/ ctx[22][0].name + "";
    	let t1;
    	let t2;
    	let small0;
    	let small0_id_value;
    	let t3;
    	let small1;
    	let small1_id_value;
    	let t4;
    	let small2;
    	let t5_value = `Price: £${/*shop*/ ctx[22].basketPrice}` + "";
    	let t5;
    	let li_id_value;
    	let t6;
    	let mounted;
    	let dispose;

    	function click_handler_4() {
    		return /*click_handler_4*/ ctx[13](/*shop*/ ctx[22]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			div = element("div");
    			h5 = element("h5");
    			t0 = text("Shop name: ");
    			t1 = text(t1_value);
    			t2 = space();
    			small0 = element("small");
    			t3 = space();
    			small1 = element("small");
    			t4 = space();
    			small2 = element("small");
    			t5 = text(t5_value);
    			t6 = space();
    			attr_dev(h5, "class", "mb-1");
    			add_location(h5, file$1, 172, 10, 5515);
    			attr_dev(small0, "class", "text-muted");
    			attr_dev(small0, "id", small0_id_value = `duration${/*i*/ ctx[24]}`);
    			add_location(small0, file$1, 173, 10, 5573);
    			attr_dev(small1, "class", "text-muted");
    			attr_dev(small1, "id", small1_id_value = `distance${/*i*/ ctx[24]}`);
    			add_location(small1, file$1, 174, 10, 5638);
    			attr_dev(small2, "class", "text-muted");
    			add_location(small2, file$1, 175, 10, 5703);
    			attr_dev(div, "class", "d-flex w-100 justify-content-between");
    			add_location(div, file$1, 171, 8, 5454);
    			attr_dev(li, "class", "list-group-item list-group-item-action");
    			attr_dev(li, "id", li_id_value = /*shop*/ ctx[22][0].id);
    			set_style(li, "z-index", "1");
    			add_location(li, file$1, 170, 8, 5279);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, div);
    			append_dev(div, h5);
    			append_dev(h5, t0);
    			append_dev(h5, t1);
    			append_dev(div, t2);
    			append_dev(div, small0);
    			append_dev(div, t3);
    			append_dev(div, small1);
    			append_dev(div, t4);
    			append_dev(div, small2);
    			append_dev(small2, t5);
    			insert_dev(target, t6, anchor);

    			if (!mounted) {
    				dispose = listen_dev(li, "click", prevent_default(click_handler_4), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*locationsDistanceObj*/ 2 && t1_value !== (t1_value = /*shop*/ ctx[22][0].name + "")) set_data_dev(t1, t1_value);
    			if (dirty & /*locationsDistanceObj*/ 2 && t5_value !== (t5_value = `Price: £${/*shop*/ ctx[22].basketPrice}` + "")) set_data_dev(t5, t5_value);

    			if (dirty & /*locationsDistanceObj*/ 2 && li_id_value !== (li_id_value = /*shop*/ ctx[22][0].id)) {
    				attr_dev(li, "id", li_id_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (detaching) detach_dev(t6);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(168:4) {#each locationsDistanceObj as shop, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div0;
    	let button0;
    	let i0;
    	let t0;
    	let t1;
    	let div1;
    	let t2;
    	let div2;
    	let button1;
    	let i1;
    	let t3;
    	let div3;
    	let input;
    	let t4;
    	let i2;
    	let t5;
    	let div4;
    	let mounted;
    	let dispose;

    	function select_block_type(ctx, dirty) {
    		if (/*toggle*/ ctx[2] == 1) return create_if_block_2;
    		if (/*toggle*/ ctx[2] == 2) return create_if_block_3;
    		if (/*toggle*/ ctx[2] == 3) return create_if_block_4;
    		if (/*toggle*/ ctx[2] == 4) return create_if_block_5;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type && current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*locationsDistanceObj*/ ctx[1].length != 0) return create_if_block$1;
    		if (/*searched*/ ctx[4] > 0) return create_if_block_1$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1 && current_block_type_1(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			div1 = element("div");
    			t2 = space();
    			div2 = element("div");
    			button1 = element("button");
    			i1 = element("i");
    			t3 = space();
    			div3 = element("div");
    			input = element("input");
    			t4 = space();
    			i2 = element("i");
    			t5 = space();
    			div4 = element("div");
    			if (if_block1) if_block1.c();
    			attr_dev(i0, "class", "fas fa-bars menuButton");
    			add_location(i0, file$1, 116, 2, 3623);
    			attr_dev(button0, "class", "menuContainer");
    			add_location(button0, file$1, 115, 1, 3590);
    			add_location(div0, file$1, 114, 0, 3583);
    			attr_dev(div1, "id", "interactiveMap");
    			attr_dev(div1, "class", "mapHome");
    			add_location(div1, file$1, 148, 1, 4486);
    			attr_dev(i1, "class", "far fa-compass centerButton");
    			add_location(i1, file$1, 153, 4, 4626);
    			attr_dev(button1, "class", "centerContainer");
    			add_location(button1, file$1, 152, 2, 4568);
    			add_location(div2, file$1, 151, 0, 4560);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "class", "form-control");
    			set_style(input, "border-radius", "25px");
    			attr_dev(input, "id", "input");
    			attr_dev(input, "placeholder", "Search Ingredient");
    			add_location(input, file$1, 159, 2, 4805);
    			attr_dev(i2, "class", "fas fa-search-location inputIcon");
    			add_location(i2, file$1, 160, 2, 4980);
    			attr_dev(div3, "class", "input-group mb-3 input-group-lg ingredientInput");
    			set_style(div3, "position", "absolute");
    			add_location(div3, file$1, 158, 0, 4713);
    			attr_dev(div4, "class", "list-group listContainer");
    			add_location(div4, file$1, 165, 0, 5054);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			insert_dev(target, t0, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, button1);
    			append_dev(button1, i1);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, input);
    			set_input_value(input, /*ingredient*/ ctx[0]);
    			append_dev(div3, t4);
    			append_dev(div3, i2);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, div4, anchor);
    			if (if_block1) if_block1.m(div4, null);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button1, "click", centerMap, false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[12]),
    					listen_dev(
    						input,
    						"input",
    						function () {
    							if (is_function(/*handleSubmit*/ ctx[5](/*ingredient*/ ctx[0]))) /*handleSubmit*/ ctx[5](/*ingredient*/ ctx[0]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if (if_block0) if_block0.d(1);
    				if_block0 = current_block_type && current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(t1.parentNode, t1);
    				}
    			}

    			if (dirty & /*ingredient*/ 1 && input.value !== /*ingredient*/ ctx[0]) {
    				set_input_value(input, /*ingredient*/ ctx[0]);
    			}

    			if (current_block_type_1 === (current_block_type_1 = select_block_type_1(ctx)) && if_block1) {
    				if_block1.p(ctx, dirty);
    			} else {
    				if (if_block1) if_block1.d(1);
    				if_block1 = current_block_type_1 && current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div4, null);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);

    			if (if_block0) {
    				if_block0.d(detaching);
    			}

    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t2);
    			if (detaching) detach_dev(div2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div3);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(div4);

    			if (if_block1) {
    				if_block1.d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Home", slots, []);
    	let ingredient, shopLatx, shopLngx, distances;
    	let locations = searchIngredients(ingredient);
    	let info = ingredientInfo(ingredient);
    	let locationsDistanceObj = [];
    	let ingredientObj = [];
    	let toggle = 1;
    	let travelMode = google.maps.TravelMode.WALKING;
    	let selectedMode = google.maps.DirectionsTravelMode.WALKING;
    	let searched = 0;

    	//On startup open map
    	onMount(() => {
    		mapCurrentLocation();
    	});

    	//Handles each key input
    	function handleSubmit(ingredient) {
    		// console.log(ingredient)
    		info = ingredientInfo(ingredient);

    		locations = searchIngredients(ingredient);

    		//Will probably need to fix when searching for multiple items. 
    		info.then(function (result) {
    			if (result) {
    				ingredientObj = [];

    				for (var x = 0; x < result.length; x++) {
    					ingredientObj.push(result[x]);
    				}
    			} else {
    				ingredientObj = [];
    				shopLatx = null;
    				shopLngx = null;
    			}
    		});

    		locations.then(function (result) {
    			if (result.length != 0) {
    				distances = createLocationMarkers(result, travelMode);
    				$$invalidate(1, locationsDistanceObj = optimiseRoute(result, distances));
    				$$invalidate(4, searched = 1);

    				for (var x = 0; x < locationsDistanceObj.length; x++) {
    					getTravelInfo(x, locationsDistanceObj[x][0].lat, locationsDistanceObj[x][0].lng, travelMode);
    				}
    			} else {
    				$$invalidate(1, locationsDistanceObj = []);
    				clearMarkers();
    				mapCurrentLocation();
    			}
    		});
    	}

    	//Draws path from current location to store location selected
    	function routeMe(shopLat, shopLng, selectedMode) {
    		shopLatx = shopLat;
    		shopLngx = shopLng;
    		drawPath(shopLat, shopLng, selectedMode);
    		document.body.scrollTop = 0;
    		document.documentElement.scrollTop = 0;
    	}

    	//Handles transport toggle button and updates all transport info
    	function transportToggle() {
    		$$invalidate(2, toggle += 1);

    		if (toggle > 4) {
    			$$invalidate(2, toggle = 1);
    		}

    		switch (toggle) {
    			case 1:
    				$$invalidate(3, selectedMode = google.maps.DirectionsTravelMode.WALKING);
    				travelMode = google.maps.TravelMode.WALKING;
    				break;
    			case 2:
    				$$invalidate(3, selectedMode = google.maps.DirectionsTravelMode.BICYCLING);
    				travelMode = google.maps.TravelMode.BICYCLING;
    				break;
    			case 3:
    				$$invalidate(3, selectedMode = google.maps.DirectionsTravelMode.DRIVING);
    				travelMode = google.maps.TravelMode.DRIVING;
    				break;
    			case 4:
    				$$invalidate(3, selectedMode = google.maps.DirectionsTravelMode.TRANSIT);
    				travelMode = google.maps.TravelMode.TRANSIT;
    				break;
    			default:
    				$$invalidate(3, selectedMode = google.maps.DirectionsTravelMode.WALKING);
    				travelMode = google.maps.TravelMode.WALKING;
    		}

    		if (shopLatx != null) {
    			drawPath(shopLatx, shopLngx, selectedMode);
    		}

    		for (var x = 0; x < locationsDistanceObj.length; x++) {
    			getTravelInfo(x, locationsDistanceObj[x][0].lat, locationsDistanceObj[x][0].lng, travelMode);
    		}
    	}

    	//Support function to get duration and distance
    	function getTravelInfo(i, shopLat, shopLng, travelMode) {
    		getTimeTaken(i, shopLat, shopLng, travelMode);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => transportToggle();
    	const click_handler_1 = () => transportToggle();
    	const click_handler_2 = () => transportToggle();
    	const click_handler_3 = () => transportToggle();

    	function input_input_handler() {
    		ingredient = this.value;
    		$$invalidate(0, ingredient);
    	}

    	const click_handler_4 = shop => routeMe(shop[0].lat, shop[0].lng, selectedMode);

    	$$self.$capture_state = () => ({
    		link,
    		navigate,
    		onMount,
    		afterUpdate,
    		onDestroy,
    		searchIngredients,
    		storeLocations,
    		ingredientInfo,
    		optimiseRoute,
    		homeMap: mapCurrentLocation,
    		distance,
    		centerMap,
    		createLocationMarkers,
    		drawPath,
    		clearMarkers,
    		getTimeTaken,
    		ingredient,
    		shopLatx,
    		shopLngx,
    		distances,
    		locations,
    		info,
    		locationsDistanceObj,
    		ingredientObj,
    		toggle,
    		travelMode,
    		selectedMode,
    		searched,
    		handleSubmit,
    		routeMe,
    		transportToggle,
    		getTravelInfo
    	});

    	$$self.$inject_state = $$props => {
    		if ("ingredient" in $$props) $$invalidate(0, ingredient = $$props.ingredient);
    		if ("shopLatx" in $$props) shopLatx = $$props.shopLatx;
    		if ("shopLngx" in $$props) shopLngx = $$props.shopLngx;
    		if ("distances" in $$props) distances = $$props.distances;
    		if ("locations" in $$props) locations = $$props.locations;
    		if ("info" in $$props) info = $$props.info;
    		if ("locationsDistanceObj" in $$props) $$invalidate(1, locationsDistanceObj = $$props.locationsDistanceObj);
    		if ("ingredientObj" in $$props) ingredientObj = $$props.ingredientObj;
    		if ("toggle" in $$props) $$invalidate(2, toggle = $$props.toggle);
    		if ("travelMode" in $$props) travelMode = $$props.travelMode;
    		if ("selectedMode" in $$props) $$invalidate(3, selectedMode = $$props.selectedMode);
    		if ("searched" in $$props) $$invalidate(4, searched = $$props.searched);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		ingredient,
    		locationsDistanceObj,
    		toggle,
    		selectedMode,
    		searched,
    		handleSubmit,
    		routeMe,
    		transportToggle,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		input_input_handler,
    		click_handler_4
    	];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/Settings.svelte generated by Svelte v3.31.0 */

    function create_fragment$4(ctx) {
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
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props) {
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
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$4.name
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

    	route0 = new Route({
    			props: { path: "/", component: Home },
    			$$inline: true
    		});

    	route1 = new Route({
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

    function create_fragment$5(ctx) {
    	let router;
    	let current;

    	router = new Router({
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
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Home, Settings, Router, Route, Link });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
