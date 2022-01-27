
import { _decorator, Component, Node, Vec3, Enum, Sprite, Label, SpriteFrame, find, Texture2D, CCInteger } from 'cc'
const { ccclass, property, executeInEditMode, menu, help, integer, float, type } = _decorator

enum A {
    c, d
}
Enum(A)

/**
 * Predefined variables
 * Name = HelloWorld
 * DateTime = Tue Dec 21 2021 11:48:25 GMT+0800 (中国标准时间)
 * Author = binea
 * FileBasename = HelloWorld.ts
 * FileBasenameNoExtension = HelloWorld
 * URL = db://assets/HelloWorld.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *s
 */
 
@ccclass('HelloWorld')
@menu('foo/bar/helloWorld.ts')
@help('https://www.google.com')
export class HelloWorld extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    @integer
    index = 111

    @property(Node)
    typeNode: Node | null = null

    @type([Node])
    children: Node[] = []

    @property
    text = ''

    @property
    children2 = []

    @property({ visible: false })
    valueB = 'abc'

    @property({ type: A })
    accx: A = A.c

    @property({ type:  SpriteFrame })
    private mySprite: SpriteFrame = null
    @property({ type:  SpriteFrame })
    bulletSprite = null
    @property({ type: Node }) 
    gun = null

    _bulletRect = null

    onLoad() {
        // this._bulletRect = this.bulletSprite.getRect()
        this.gun = find('hand/weapon', this.node)
        console.log('on load ---')
        this.node.setPosition(1, 2, 3)

        this.node.on('foo', (arg1, arg2, arg3) => {
            console.log('fuck ? ', arg1, arg2, arg3)
        })
    }

    onEnable() {
        console.log('on enable --')
    }

    public v = new Vec3()
    private labelTest1: any = null

    @property({ type: Node })
    private player = null

    @property({ type: Texture2D })
    private texture: Texture2D = null

    @property
    get num() {
        return this._num
    }

    @property({ type: CCInteger, tooltip: 'the num of fuck' })
    private _num = 17

    start () {
        // [3]
        console.log('hello new cocos creator - 3.4 - test 5', this.v)
        console.log('node -- active ? ', this.node.active, this.node)
        
        this.labelTest1 = this.getComponent(Label)
        if (this.labelTest1) {
            this.labelTest1.string = 'hello'
        } else {
            console.error('something wrong ? ')
        }

        console.log('the player is ', this.player && this.player.name)

        // new node
        const newNode = new Node('box')
        console.log('new node')
        newNode.setPosition(0, 0, -10)

        let startTexture = this.texture
        console.log('get texture2D -- ', startTexture)

        console.log('yep --- ', this.num)

        // this.node.on(Node.EventType.MOUSE_DOWN, (event) => {
        //     console.log('Node.EventType.MOUSE_DOWN ?')
        // }, this)

        let arg1 = 11
        let arg2 = 22
        let arg3 = 33

        this.node.emit('foo', arg1, arg2, arg3)
    }

    // update (deltaTime: number) {
    //     // [4]
    //     console.log('update dt --- ')
    // }

    // 分组一
    @property({ group: { name: 'bar' }, type: Label })
    label: Label = null!

    @property({ group: { name: 'foo' }, type: Sprite })
    sprite: Sprite = null!

    // 分组二
    @property({ group: { name: 'bar2', id: '2', displayOrder: 1 }, displayOrder: 2, type: Label })
    label2: Label = null!
    @property({ group: { name: 'bar2', id: '2' }, displayOrder: 1, type: Sprite })
    sprite2: Sprite = null!

}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/en/scripting/life-cycle-callbacks.html
 */
