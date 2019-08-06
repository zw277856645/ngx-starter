import { ListFilterConfig, ListFilterPipe } from './list-filter.pipe';

describe('list filter pipe', () => {
    const config = new ListFilterConfig();
    const pipe = new ListFilterPipe(config);

    const list = [
        {
            name: '张三',
            age: 12,
            addr: {
                street: '南京路',
                code: '25号'
            },
            man: true,
            loves: [ '苹果', '橘子' ]
        },
        {
            name: '翠花',
            age: 28,
            addr: {
                street: '北京路',
                code: '1223号'
            },
            man: true,
            loves: [ '苹果', '栗子', '桃子' ]
        }
    ];

    describe('测试 isPrimitive 方法', () => {
        let caller: Function;

        beforeEach(() => {
            caller = spyOn(ListFilterPipe, 'isPrimitive').and.callThrough();
        });

        it('所有原始类型返回 true，其他返回 false', () => {
            expect(caller.call(null, 1)).toBeTruthy();
            expect(caller.call(null, 'any')).toBeTruthy();
            expect(caller.call(null, null)).toBeTruthy();
            expect(caller.call(null, undefined)).toBeTruthy();
            expect(caller.call(null, false)).toBeTruthy();
            expect(caller.call(null, Symbol())).toBeTruthy();
            expect(caller.call(null, NaN)).toBeTruthy();

            expect(caller.call(null, {})).toBeFalsy();
            expect(caller.call(null, [])).toBeFalsy();
            expect(caller.call(null, /any/)).toBeFalsy();
        });
    });

    describe('filter 是原始类型，执行 compareDeep 方法', () => {
        let caller: Function;

        beforeEach(() => {
            caller = spyOn(pipe, 'compareDeep');
        });

        it('filter 是原始类型', () => {
            pipe.transform(list, 23);
            expect(caller).toHaveBeenCalled();
        });

        it('filter 是只具有单个比较操作符的对象', () => {
            pipe.transform(list, { '$gt': 1 });
            expect(caller).toHaveBeenCalled();
        });

        it('filter 是对象', () => {
            pipe.transform(list, { age: 19 });
            expect(caller).not.toHaveBeenCalled();
        });

        it('filter 是含多个比较操作符的对象', () => {
            pipe.transform(list, { '$gt': 1, '$fullMatch': 'n' });
            expect(caller).not.toHaveBeenCalled();
        });

        it('filter 不是比较操作符', () => {
            pipe.transform(list, { '$or': 1 });
            expect(caller).not.toHaveBeenCalled();
        });
    });

});