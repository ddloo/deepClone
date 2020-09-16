const toString = Object.prototype.toString

const regexpTag = '[object RegExp]'
const dateTag = '[object Date]'
const mapTag = '[object Map]'
const setTag = '[object Set]'

const cloneTags = {}
cloneTags[regexpTag] = cloneTags[dateTag] = 
cloneTags[mapTag] = cloneTags[setTag] = true

let stack = {}

function isObject(value){
    const type = typeof value
    return value != null && (type === 'object' || type === 'function')
}

function initCloneArray(array){
    const {length} = array
    let result = new Array(length)
    return result
}

function initCloneTag(obj, tag){
    const construct = obj.constructor
    switch (tag){
        case regexpTag:
            return construct(obj)
        case dateTag:
            return new construct(+obj)
        case mapTag:
        case setTag:
            return new construct
    }
}

function initCloneObj(){
    let result = new Object()
    return result
}

function getTag(value){
    return toString.call(value)
}

function deepClone(value){
    if(!isObject(value)){
        return value
    }
    let isArr = Array.isArray(value)
    let tag = getTag(value)
    let result = isArr ? initCloneArray(value) : initCloneObj()

    // 初始化特殊对象
    if(cloneTags[tag]){
        result = initCloneTag(value, tag)
    }

    // 处理set对象
    if(tag === setTag){
        value.forEach(key => {
            result.add(deepClone(key))
        });
        return result
    }

    // 处理map对象
    if(tag === mapTag){
        value.forEach((key, mapValue) => {
            result.set(key, deepClone(mapValue))
        })
    }

    if(value){
        Reflect.ownKeys(value).forEach(key => {
            if(value[key] && isObject(value[key])){
                if(stack[value[key]]){
                    result[key] = stack[value[key]]
                } else {
                    stack[value[key]] = value[key]
                    result[key] = deepClone(value[key])
                }
            } else {
                result[key] = deepClone(value[key])
            }
        })
        return result
    }
}

const c = /[A-Z]/ig
const d = new Date()
const q = new Set([1,2])
const u = new Map([
    ['one', 'okk'],
    ['two', 'ogg']
])
const e = c.exec('AA')
const arr = [1,2]

let a = [2, [1,3], {a: 2}, c, d, e, q, u]
let b = deepClone(a)
console.log(b)