<template>
  <p>
    Data sharing has become of primary importance in many domains such as big-data analytics, economics and medical
    research, but remains difficult to achieve when the data are sensitive. In fact, sharing personal information
    requires individuals’ unconditional consent or is often simply forbidden for privacy and security reasons. In this
    paper, we propose Drynx, a decentralized system for privacy-conscious statistical analysis on distributed datasets.
  </p>

  <img src="/showcase_v2/products/images/drynx/presentation-overview.png" width="60%" class="center" />
  <br />
  <p>
    Drynx relies on a set of computing nodes to enable the computation of statistics such as standard deviation or
    extrema, and the training and evaluation of machine-learning models on sensitive and distributed data. To ensure
    data confidentiality and the privacy of the data providers, Drynx combines interactive protocols, homomorphic
    encryption, zero-knowledge proofs of correctness, and differential privacy. It enables an efficient and
    decentralized verification of the input data and of all the system’s computations thus provides auditability in a
    strong adversarial model in which no entity has to be individually trusted.
  </p>
  <p>
    Drynx is highly modular, dynamic and parallelizable. Our evaluation shows that it enables the training of a logistic
    regression model on a dataset (12 features and 600,000 records) distributed among 12 data providers in less than 2
    seconds. The computations are distributed among 6 computing nodes, and Drynx enables the verification of the query
    execution’s correctness in less than 22 seconds.
  </p>
</template>
