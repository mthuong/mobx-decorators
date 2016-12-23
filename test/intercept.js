import {observable, action} from 'mobx'
import {intercept, observe} from '../'


describe('intercept', () => {
  it('should fail if @intercept called without params', () => {
    (() => class User {
      @intercept
      @observable
      loggedIn = false;
    }).should.throw()
  });


  it('should fail if @intercept defined after @observable', () => {
    (() => class User {
      @observable
      @intercept(() => {})
      loggedIn = false;
    }).should.throw()
  });


  it('should @intercept be called', () => {
    let loginCount = -1;

    class User {
      @intercept(change => {
        loginCount = change.newValue;
        return change;
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    loginCount.should.be.equal(1);
  });


  it('should @intercept chain works', () => {
    let firstCalled = false, secondCalled = false;

    class User {
      @intercept(change => {
        firstCalled = true;
        return change;
      })
      @intercept(change => {
        secondCalled = true;
        return change;
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();
  });


  it('should @intercept change ignore works', () => {
    class User {
      @intercept(() => {})
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(0);
  });


  it('should @intercept work in chain with @observe', () => {
    let firstCalled = false, secondCalled = false;

    class User {
      @observe(() => firstCalled = true)
      @intercept(change => {
        secondCalled = true;
        return change;
      })
      @observable
      loginCount = 0;

      @action login() {
        this.loginCount += 1;
      }
    }

    const user = new User();
    user.should.have.property('loginCount').which.is.equal(0);

    user.login();
    user.should.have.property('loginCount').which.is.equal(1);
    firstCalled.should.be.true();
    secondCalled.should.be.true();
  });
});