

### Authorization
- github

### Slug to gist
- read the slug
- Create the page on the fly

### ClientSide Scripts
- Function doBenchmark (vm)
  - Initialize
  - benchmark start
    - Do test
  - benchmark stop
  - Cleanup

- Function doTest (code)
  - create vm(code) //Either within an iframe, webworker or shim
  - while(number < limit && Date.now() < stopTime) return doBenchmark(vm);
  - We hit a limit for number of iterations
  - we hit a limit for amount of time

### On Finish
- We send to our server the results
- We send to browserscope our results

### Enable Comments
- Commenst tie into gist
