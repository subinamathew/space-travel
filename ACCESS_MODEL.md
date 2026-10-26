# RocketRun Access Model

RocketRun is intentionally operated as a closed-circle, invitation-style experience rather than as an unrestricted public application.

## Purpose

The shared passcode gate exists to:

- make access intentional rather than open browsing;
- keep the experience oriented to invited users;
- support the owner's intended closed-circle/private-access positioning;
- preserve that positioning across the home page, generated planet pages, credits, features, and changelog pages.

The owner also relies on this restricted-access model as part of the site's intended legal treatment, including its position regarding German imprint obligations. This document describes the technical intent only; it does not assert that a particular legal exemption automatically applies.

## Security boundary

The gate is client-side by design. The passcode and access-state logic are delivered to the browser, so a technically capable visitor can inspect or bypass them.

Therefore:

- do not store secrets, confidential records, private files, credentials, or sensitive personal information behind this gate;
- do not describe it as strong authentication or authorization;
- do not replace it with server-side authentication merely as a cleanup unless the owner explicitly decides to change the access model;
- security headers, CSP, output escaping, dependency hygiene, and ordinary web hardening still apply independently.

## Persistence

Successful access is remembered using first-party browser storage so invited users are not repeatedly challenged. Clearing the relevant site storage intentionally revokes that remembered access state.

## Contributor rule

Changes to the gate should preserve the closed-circle user experience unless the project owner explicitly approves a different access model. Refactors may improve CSP compatibility, accessibility, maintainability, or code safety without changing the intended access semantics.
