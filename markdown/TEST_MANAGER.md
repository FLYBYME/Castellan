# Testing the manager

This is the process to use to test the manager

First use the git url fo `https://github.com/FLYBYME/apt_cache.git`
This project is a APT cache server written in Node.js.
It has no tests.



## Steps

## Setup

Create the thread and get the threadId

```bash
npm run cli -- threads create --title "Test manager" --model "gpt-oss:20b" --status "active"
```

Output is 
```
{
  "title": "Test manager",
  "status": "active",
  "model": "gpt-oss:20b",
  "autoApproveDestructiveTools": false,
  "createdAt": "2026-05-23T19:54:08.118Z",
  "updatedAt": "2026-05-23T19:54:08.118Z",
  "id": "6a1205e026309be486b9d827"
}
```

Get the threadId = 6a1205e026309be486b9d827

## Test 1

Start the manager in interactive mode with the threadId

```bash
npm run cli -- chat --thread 6a1205e026309be486b9d827 --prompt "List all the tools you have available to use."
```

Manager should respond with the list of tools.

## Test 2

Ask the manager to run the tests for the apt cache project.

```bash
npm run cli -- chat --thread 6a1205e026309be486b9d827 --prompt "Run the tests for the apt cache project."
```

Output should be that there are no tests to run.

## Test 3

Get the manager to create the tests for the apt cache project.

```bash
npm run cli -- chat --thread 6a1205e026309be486b9d827 --prompt "Create the tests for the apt cache project."
```

Output should be that the tests have been created.


# Analyze output

Save your output to `markdown/TEST_MANAGER_OUTPUT_<DATE>.md`
Where <DATE> is the date in YYYYMMDDHHMM format.

# Run analysis on the manager

```bash
npm run cli -- thread -t 6a1205e026309be486b9d827
```



# Considerations

You might want to clean up the kanban board after testing.
The thread will become polluted as you test.

