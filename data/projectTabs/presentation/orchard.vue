<template>
  <p>
    Starting in the late 2010s, security and computer-related conferences acknowledged the presence (or not) of software
    artifacts accompanying research papers. This move was motivated by the need to be able to reproduce results in
    research papers. However, for the conference committees, evaluating these artifacts is still a very time-intensive
    process. The artifacts need to be tested, potentially modified to actually run them, and then the required
    infrastructure needs to be available.
  </p>
  <p>
    In order to streamline evaluation of these software artifacts, Mathias Payer decided to create a platform allowing
    researchers to submit their software artifacts. These will then be evaluated by the platform, and can be compared to
    other submitted artifacts. The C4DT Factory and Mathias Payer's lab started working on the "Orchestrated Artifact
    Evaluation", or Orchard for short.
  </p>
  <h3>System Description</h3>
  <p>
    The goal of Orchard is to provide a platform for software artifacts related to security papers describing fuzzing
    methods. For this purpose, it provides a Docker environment with configuration files, based on GitLab CI. In its
    current state, the platform is run by the "Research Computing Platform (RCP)" at EPFL on a rented server. It allows
    users to upload new artifacts, which are then evaluated on the server, and compared to other artifacts.
  </p>
  <p>
    During 2025, the project will be tested with existing software artifacts, and semester student projects at EPFL will
    help adding more artifacts for testing and refining the use-cases.
  </p>
  <p>
    If there is an interest from industry or from other entities to extend the system to other types of software
    artifacts, we're happy to listen to your suggestions.
  </p>
</template>
