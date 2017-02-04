module.exports = new Proxy(new Function(), {
  apply(target, receiver, args){
    let
      newSubscribers
      ,root = new Proxy(args[0](new Proxy(target, {
        apply(target, receiver, args) {

          return new Proxy(args[0], {
            get(target, key, receiver) {
              // console.log('%c get this:', 'background:rgb(143, 16, 65)', this);
              if(key === 'computed') {
                return true;
              } else if(key === 'this') {
                return this;
              } else {
                return target;
              }
            },
          });
        },

      })), {

        get(target, key, receiver) {
          return this.set(target, key, undefined, receiver);
        },

        set(target, key, newValue, receiver) {
          let
            type = (vaue, type) => {
              return !!~Object.prototype.toString.call(value).indexOf(type);
            }
            ,value = target[key]
          ;

          if(type(value, 'Function') && value.computed){
            if(newSubscribers || newValue) {
              console.log('newSubscribers || newValue');
              var
                subscribers = newSubscribers
                ? (value.this.subscribers || new Map()).set(newSubscribers[0], newSubscribers[1])
                : value.this.subscribers
                ,canche = () => {
                  for(let item of subscribers) {
                    item[0][item[1]] = value;
                    console.log('item:', item);
                  }
                }
              ;

              Reflect.set(
                target,
                key,
                new Proxy(newValue ? () => newValue : value,
                newSubscribers ? Object.assign(value.this, {
                  subscribers,
                }) : value.this),
                receiver
              );
            }
            newSubscribers = false;
            let
              context = {
                root,
                current: receiver || root,
                parent: this.parent || root,
              }
            ;

            // value = target[key](context, ...Object.values(context));
            value = target[key](context);

            canche && canche();

            return value;

          } else if(type(value, 'Object')) {
            console.log('Object');
            return new Proxy(value, Object.assign(this, {
              parent: receiver,
            }));

          } else if(newValue) {

            return target[key] = newValue;

          } else {
            console.log('String value:', value);

            return value;

          }

        },

      })
    ;
    return new Proxy(target, {
      get(target, key, receiver) {
        return root[key];
      },
      apply(target, receiver, args) {
        newSubscribers = args.length ? args : false;
        return root;
      },
      set(target, key, value, receiver) {
        return root[key] = value;
      },
    });
  },
});
