# prepare-machine-thingy-deployment - Small cli to prepare deployments for a machine - the webhooks and deployKeys.

# Why?
The toolset for the machine thingy requires such a tool.

More generally we need a tool which communicates to our cloudservices that:

- it will trigger a webhook on a push event to a specified repository
- it knows read-only deployment keys to hand out the updates

# What?
prepare-machine-thingy-deployment - is a small cli tool, which takes advantage of the way how cloudservices are handled by [thingycreate](https://www.npmjs.com/package/thingycreate). It uses this access to add or remove the relevant webhooks or deployment keys.

Therefore it takes a configuration file `.json` to read out the relevant parameters. It is mainly built having the configuration file of a `machine-thingy` in mind - which also takes care of an installer to set up the machine itself.

However it is independently usable.

# How?
Requirements
------------
* [GitHub account](https://github.com/) and/or [Gitlab account](https://gitlab.com/)
* [GitHub ssh-key access](https://help.github.com/en/github/authenticating-to-github/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent) and/or [Gitlab ssh-key-access](https://docs.gitlab.com/ee/gitlab-basics/create-your-ssh-keys.html)
* [GitHub access token (repo scope)](https://github.com/settings/tokens) and/or [Gitlab access token (api scope)](https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html)
* [Git installed](https://git-scm.com/)
* [Node.js installed](https://nodejs.org/)
* [Npm installed](https://www.npmjs.com/)
* [OpenSSH installed](https://www.openssh.com/)

Installation
------------

Npm Registry
``` sh
$ npm install prepare-machine-thingy-deployment
```

Current git version
``` sh
$ npm install git+https://github.com/JhonnyJason/prepare-machine-thingy-deployment-output.git
```

Usage
-----

```
$ prepare-machine-thingy-deployment --help

  Usage
      $ prepare-machine-thingy-deployment <arg1> <arg2> <arg3>
    
  Options
      required:
      arg1, --keys-directory <path/to/keys>, -k <path/to/keys>
          path of directory where old keys are kept and the new ones will be stored
      arg2, --machine-config <machine-config>, -c <machine-config>
          path to file which if the machine-config
    
      optional:
      arg3, --mode <mode>, -m <mode>  
          "prepare" (default) - we keep old keys and add the missing ones - same holds for the webhooks
          "refresh" - we remove all old keys and webhooks and add new ones
          "remove" - well... aaaand it's gone, it's all gone!
  TO NOTE:
      The flags will overwrite the flagless argument.

  Examples
      $ prepare-machine-thingy-deployment keys allRepos refresh
      ...

```

machineConfig
-----

To be interpreted correctly the machine-config file must meet following requirements.

It must export an object as follows:
```javascript
module.exports = {
    serverName = "example.webhook-handler.com",
    name = "exampleMachineName",
    webhookSecret = "supersecretsecret",
    webhookPort = 4567,
    thingies = [...]
}
```
Furtherly For each thingy to deploy we have an object in the array.
While the detailed specification what you need in your machine-config might vary strongly it is required to contain the repository name of the deployable thingy part. 

**Plus - for now - it has to be owned by your user!**
```javascript
{
    repository: "example-machine-1-output",
    ...
}
```

Result
-----
This will produce an active webhook of type `application/json` to `http://7.4.7.6:4567/webhook` which is triggered on push events.

Also it will create new ssh-keys in OpenSSH format [RFC 4253](https://tools.ietf.org/html/rfc4253#section-6.6) (actually uses openssh over the node-keygen package^^). The key pairs will be stored in the given `keysDirectory` and the public key will be added as `read_only` deploy key.

The title of the deploy key is the used `name` property of the machine-config object.

*Notice: It is thought to have 1 deployment for one repository on a certain machine. Thus the deploy keys are identifiable by their titles. Donot use a machine name multiple times!*

# Further steps
This tool will be furtherly extended, mainly to fit my own needs.
Ideas of what could come next:

- add meaningful diagnosis on errors (404 etc.)
- ...

All sorts of inputs are welcome, thanks!

---

# License

## The Unlicense JhonnyJason style

- Information has no ownership.
- Information only has memory to reside in and relations to be meaningful.
- Information cannot be stolen. Only shared or destroyed.

And you wish it has been shared before it is destroyed.

The one claiming copyright or intellectual property either is really evil or probably has some insecurity issues which makes him blind to the fact that he also just connected information which was freely available to him.

The value is not in him who "created" the information the value is what is being done with the information.
So the restriction and friction of the informations' usage is exclusively reducing value overall.

The only preceived "value" gained due to restriction is actually very similar to the concept of blackmail (power gradient, control and dependency).

The real problems to solve are all in the "reward/credit" system and not the information distribution. Too much value is wasted because of not solving the right problem.

I can only contribute in that way - none of the information is "mine" everything I "learned" I actually also copied.
I only connect things to have something I feel is missing and share what I consider useful. So please use it without any second thought and please also share whatever could be useful for others. 

I also could give credits to all my sources - instead I use the freedom and moment of creativity which lives therein to declare my opinion on the situation. 

*Unity through Intelligence.*

We cannot subordinate us to the suboptimal dynamic we are spawned in, just because power is actually driving all things around us.
In the end a distributed network of intelligence where all information is transparently shared in the way that everyone has direct access to what he needs right now is more powerful than any brute power lever.

The same for our programs as for us.

It also is peaceful, helpful, friendly - decent. How it should be, because it's the most optimal solution for us human beings to learn, to connect to develop and evolve - not being excluded, let hanging and destroy.

If we really manage to build an real AI which is far superior to us it will unify with this network of intelligence.
We never have to fear superior intelligence, because it's just the better engine connecting information to be most understandable/usable for the other part of the intelligence network.

The only thing to fear is a disconnected unit without a sufficient network of intelligence on its own, filled with fear, hate or hunger while being very powerful. That unit needs to learn and connect to develop and evolve then.

We can always just give information and hints :-) The unit needs to learn by and connect itself.

Have a nice day! :D