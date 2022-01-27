
import { _decorator, Component, Node, Vec3, input, Input, EventMouse, Animation } from 'cc';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = PlayerController
 * DateTime = Thu Jan 27 2022 15:23:55 GMT+0800 (中国标准时间)
 * Author = binea
 * FileBasename = PlayerController.ts
 * FileBasenameNoExtension = PlayerController
 * URL = db://assets/Scripts/PlayerController.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/zh/
 *
 */

enum MyAnimation {
    OneStep = 'oneStep',
    TwoStep = 'twoStep'
}
 
@ccclass('PlayerController')
export class PlayerController extends Component {
    // [1]
    // dummy = '';

    // [2]
    // @property
    // serializableDummy = 0;

    // for fake tween
    // 是否接收到跳跃指令
    private _startJump: boolean = false;

    // 跳跃步长
    private _jumpStep: number = 0;

    // 当前跳跃时间
    private _curJumpTime: number = 0;

    // 每次跳跃时长
    private _jumpTime: number = 0.1;

    // 当前跳跃速度
    private _curJumpSpeed: number = 0;

    // 当前角色位置
    private _curPos: Vec3 = new Vec3();

    // 每次跳跃过程中，当前帧移动位置差
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);

    // 角色目标位置
    private _targetPos: Vec3 = new Vec3();

    // 添加动画
    @property({ type: Animation })
    public BodyAnim: Animation | null = null;

    onMouseUp(event: EventMouse) {
        if (event.getButton() === 0) {
            this.jumpByStep(1);
        } else if (event.getButton() === 2) {
            this.jumpByStep(2)
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }
        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep / this._jumpTime;
        this.node.getPosition(this._curPos);
        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep, 0, 0));

        // 动画播放
        if (this.BodyAnim) {
            if (step === 1) {
                this.BodyAnim.play(MyAnimation.OneStep);
            } else if (step === 2) {
                this.BodyAnim.play(MyAnimation.TwoStep);
            }
        }
     }

    start () {
        // Your initialization goes here.
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);
    }

    // deltaTime => 每次更新时间差
    update (deltaTime: number) {
        if (!this._startJump) {
            return;
        }

        this._curJumpTime += deltaTime;
        if (this._curJumpTime > this._jumpTime) {
            // end
            this.node.setPosition(this._targetPos);
            this._startJump = false;
        } else {
            this.node.getPosition(this._curPos);
            this._deltaPos.x = this._curJumpSpeed * deltaTime;
            Vec3.add(this._curPos, this._curPos, this._deltaPos);
            this.node.setPosition(this._curPos);
        }
    }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.4/manual/zh/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.4/manual/zh/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.4/manual/zh/scripting/life-cycle-callbacks.html
 */
