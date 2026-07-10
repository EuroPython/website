---
title: "Research Engineer (LLM Training and Performance)"
location:
  "📍 Amsterdam, Netherlands; Belgrade, Serbia; Berlin, Germany; Limassol,
  Cyprus; London, United Kingdom; Madrid, Spain; Munich, Germany; Paphos,
  Cyprus; Prague, Czech Republic; Warsaw, Poland; Yerevan, Armenia"
type:
level:
tags:
salary:

description: |-
  At JetBrains, code is our passion. Ever since we started back in 2000, we have been striving to make the strongest, most effective developer tools on earth. By automating routine checks and corrections, our tools speed up production, freeing developers to grow, discover, and create.

  We're looking for a Research Engineer who will own the training stack and model architecture for our Mellum LLM family. Your job is easier said than done: make training faster, cheaper, and more stable at a large scale. You'll profile, design, and implement changes to the training pipeline – from architecture to custom GPU kernels, as needed.

responsibilities:
  - Be responsible for improving end-to-end performance for multi-node LLM
    pre-training and post-training pipelines.
  - Profile hotspots (Nsight Systems/Compute, NVTX) and fix them using
    compute/comm overlap, kernel fusion, scheduling, etc.
  - Design and evaluate architecture choices (depth/width, attention variants
    including GQA/MQA/MLA/Flash-style, RoPE scaling/NTK, and MoE routing and
    load-balancing).
  - Implement custom ops (Triton and/or CUDA C++), integrate via PyTorch
    extensions, and upstream when possible.
  - "Push memory/perf levers: FSDP/ZeRO, activation checkpointing, FP8/TE,
    tensor/pipeline/sequence/expert parallelism, NCCL tuning."
  - Harden large runs by building elastic and fault-tolerant training setups,
    ensuring robust checkpointing, strengthening reproducibility, and improving
    resilience to preemption.
  - Keep the data path fast using streaming and sharded data loaders and
    tokenizer pipelines, as well as improve overall throughput and cache
    efficiency.
  - Define the right metrics, build dashboards, and deliver steady improvements.
  - Run both pre-training and post-training (including SFT, RLHF, and GRPO-style
    methods) efficiently across sizable clusters.

requirements:
  - Strong PyTorch and PyTorch Distributed experience, having run multi-node
    jobs with tens to hundreds of GPUs.
  - Hands-on experience with Megatron-LM/Megatron-Core/NeMo, DeepSpeed, or
    serious FSDP/ZeRO expertise.
  - Real profiling expertise (Nsight Systems/Compute, nvprof) and experience
    with NVTX-instrumented workflows.
  - GPU programming skills with Triton and/or CUDA, and the ability to write,
    test, and debug kernels.
  - A solid understanding of NCCL collectives, as well as topology and fabric
    effects (IB/RoCE), and how they show up in traces.

preferred:
  - FlashAttention-2 and 3, CUTLASS and CuTe, TransformerEngine and FP8,
    Inductor, AOTAutograd, and torch.compile.
  - MoE at scale (expert parallel, router losses, capacity management) and
    long-context tricks (ALiBi/YaRN/NTK scaling).
  - Kubernetes or SLURM at scale, placement and affinity tuning, as well as AWS,
    GCP, and Azure GPU fleets.
  - Web-scale data plumbing (streaming datasets, Parquet and TFRecord, tokenizer
    perf), eval harnesses, and benchmarking.
  - Safety and post-training methods, such as DPO, ORPO, GRPO, and reward
    models.
  - Inference ecosystems such as vLLM and paged KV.

benefits:

apply_link: "https://job-boards.eu.greenhouse.io/jetbrains/jobs/4695363101"
---
